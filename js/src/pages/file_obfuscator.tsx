import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Scaffold,
  AppBar,
  Text,
  Column,
  Row,
  Button,
  Container,
  TextField,
  Switch,
  Divider,
  Padding,
  SizedBox,
  SingleChildScrollView,
  ListView,
  Expanded,
  InkWell,
  ToastService,
  DialogService,
  fs,
} from "fuickjs";

// fuickjs runtime 在全局注入的 native bridge
declare const dartCallNativeAsync: (
  method: string,
  args: Record<string, unknown>,
) => Promise<unknown>;

// 固定规则：在文件第 20 字节处插入 16 字节 0x00（破坏文件头，使其无法正常播放）
// 还原：从第 20 字节起删除 16 字节
const INSERT_POS = 20;
const INSERT_LEN = 16;

type FileStatus = "pending" | "processing" | "done" | "error";

interface FileEntry {
  path: string;
  name: string;
  size: number;
  status: FileStatus;
  message?: string;
  isDestroyed?: boolean;
}

const DEFAULT_DIRS: Record<string, string> = {};

async function loadDefaultDirs(): Promise<Record<string, string>> {
  try {
    const dirs = await fs.getDirectories();
    return dirs || {};
  } catch (e) {
    return {};
  }
}

function joinPath(base: string, name: string): string {
  if (!base) return name;
  if (base.endsWith("/")) return base + name;
  return base + "/" + name;
}

function basename(p: string): string {
  const i = p.lastIndexOf("/");
  return i === -1 ? p : p.substring(i + 1);
}

function matchesExt(name: string, exts: string[]): boolean {
  if (exts.length === 0) return true;
  const dot = name.lastIndexOf(".");
  if (dot === -1) return false;
  const ext = name.substring(dot + 1).toLowerCase();
  return exts.some((e) => e.toLowerCase() === ext);
}

// 递归遍历目录
async function walkDir(
  root: string,
  exts: string[],
  maxDepth = 99,
): Promise<FileEntry[]> {
  const result: FileEntry[] = [];
  const visited = new Set<string>();

  async function walk(dir: string, depth: number) {
    if (depth > maxDepth) return;
    if (visited.has(dir)) return;
    visited.add(dir);

    let entries: string[] = [];
    try {
      entries = await fs.readdir(dir);
    } catch (e) {
      console.warn("[walkDir] readdir failed:", dir, e);
      return;
    }

    for (const name of entries) {
      // 跳过隐藏文件/目录（以 . 开头）
      if (name.startsWith(".")) continue;
      const full = joinPath(dir, name);
      let stat: any = null;
      try {
        stat = await fs.stat(full);
      } catch (e) {
        console.warn("[walkDir] stat failed:", full, e);
        continue;
      }
      if (!stat) continue;

      if (stat.isFile()) {
        if (matchesExt(name, exts)) {
          result.push({
            path: full,
            name,
            size: stat.size,
            status: "pending",
            isDestroyed: false,
          });
        }
      } else if (stat.isDirectory()) {
        console.log("[walkDir] recursing into:", full);
        await walk(full, depth + 1);
      }
    }
  }

  await walk(root, 0);
  return result;
}

// base64 <-> Uint8Array helpers (保留兼容旧实现，新版已走原生 obfuscateFile)
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const len = bin.length;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk)) as any,
    );
  }
  return btoa(bin);
}

export default function FileObfuscatorPage() {
  const [dir, setDir] = useState<string>("");
  const [extInput, setExtInput] = useState<string>(
    "png,mp4,jpg,jpeg,gif,mp3,webp",
  );
  const [mode, setMode] = useState<"destroy" | "restore">("destroy");
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [scanning, setScanning] = useState(false);
  const [running, setRunning] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [log, setLog] = useState<string[]>([]);

  // 中断标志：ref 让 await 循环里能读到最新值
  const stopFlag = useRef(false);

  const exts = useMemo(
    () =>
      extInput
        .split(/[,\s]+/)
        .map((s) => s.trim().replace(/^\./, ""))
        .filter(Boolean),
    [extInput],
  );

  useEffect(() => {
    (async () => {
      try {
        const dirs = await loadDefaultDirs();
        Object.assign(DEFAULT_DIRS, dirs);
        if (dirs.documents) setDir(dirs.documents);
      } catch (e) {
        // ignore - getDirectories 在 worker isolate 中可能失败
        console.warn("[FileObfuscator] loadDefaultDirs failed:", e);
      }
    })();
  }, []);

  const appendLog = (msg: string) => {
    setLog((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50),
    );
  };

  const handlePickDirectory = async () => {
    console.log("[FileObfuscator] handlePickDirectory clicked");
    console.log(
      "[FileObfuscator] dartCallNativeAsync =",
      typeof (globalThis as any).dartCallNativeAsync,
    );
    try {
      const result = (await (globalThis as any).dartCallNativeAsync(
        "FilePicker.pickDirectory",
        {
          initialDirectory: dir || undefined,
        },
      )) as string | null;
      console.log("[FileObfuscator] pickDirectory result:", result);
      if (result) {
        setDir(result);
        appendLog(`已选择目录: ${result}`);
      } else {
        appendLog("未选择目录");
      }
    } catch (e: any) {
      console.error("[FileObfuscator] pickDirectory error:", e);
      appendLog(`选择目录失败: ${e?.message || e}`);
    }
  };

  const handleScan = async () => {
    if (!dir) {
      await DialogService.showModal({
        title: "提示",
        content: "请先填写目录路径",
        showCancel: false,
      });
      return;
    }
    setScanning(true);
    setFiles([]);
    setLog([]);
    ToastService.show("开始扫描...");
    appendLog("walkDir 入口: " + dir);
    try {
      const exists = await fs.exists(dir);
      if (!exists) {
        await DialogService.showModal({
          title: "目录不存在",
          content: dir,
          showCancel: false,
        });
        return;
      }
      const result = await walkDir(dir, exts);
      // 批量检查每个文件是否已经被破坏
      const inspectTasks = result.map(async (f) => {
        try {
          const r = (await (globalThis as any).dartCallNativeAsync(
            "FileObfuscator.inspectFile",
            { path: f.path },
          )) as { ok: boolean; isDestroyed?: boolean; error?: string };
          if (r.ok) {
            f.isDestroyed = !!r.isDestroyed;
          }
        } catch (e) {
          // ignore
        }
        return f;
      });
      const inspected = await Promise.all(inspectTasks);
      setFiles(inspected);
      const destroyedCount = inspected.filter((f) => f.isDestroyed).length;
      appendLog(
        `扫描完成：${inspected.length} 个文件，其中已破坏 ${destroyedCount} 个`,
      );
      ToastService.show(`找到 ${inspected.length} 个文件`);
    } catch (e: any) {
      appendLog(`扫描失败: ${e?.message || e}`);
    } finally {
      setScanning(false);
    }
  };

  const updateFile = (idx: number, patch: Partial<FileEntry>) => {
    setFiles((prev) => {
      const copy = prev.slice();
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  };

  const handleExecute = async () => {
    if (files.length === 0) {
      await DialogService.showModal({
        title: "提示",
        content: "请先扫描文件",
        showCancel: false,
      });
      return;
    }
    const actionLabel = mode === "destroy" ? "破坏" : "还原";
    // 过滤：破坏模式跳过已破坏的，还原模式跳过未破坏的
    const targets: number[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (mode === "destroy" && f.isDestroyed) continue;
      if (mode === "restore" && !f.isDestroyed) continue;
      targets.push(i);
    }
    if (targets.length === 0) {
      await DialogService.showModal({
        title: "无需处理",
        content:
          mode === "destroy"
            ? "所选文件均已破坏"
            : "所选文件均未破坏，无需还原",
        showCancel: false,
      });
      return;
    }
    const confirmed = await DialogService.showModal({
      title: `确认${actionLabel}`,
      content: `将对 ${targets.length} 个文件执行【${actionLabel}】操作，是否继续？`,
      showCancel: true,
      cancelText: "取消",
      confirmText: actionLabel,
    });
    if (!confirmed) return;

    // 重置中断标志
    stopFlag.current = false;
    setStopped(false);
    setRunning(true);
    setProgress({ done: 0, total: targets.length });
    appendLog(`开始${actionLabel}：${targets.length} 个文件`);

    let done = 0;
    let success = 0;
    let fail = 0;
    let interrupted = false;

    for (const i of targets) {
      // 检查中断
      if (stopFlag.current) {
        interrupted = true;
        break;
      }
      const f = files[i];
      updateFile(i, { status: "processing", message: undefined });
      try {
        // 走 obfuscateFileSafe：原地修改 pos=20..35 16 字节，.bak 永不删除
        const result = (await (globalThis as any).dartCallNativeAsync(
          "FileObfuscator.obfuscateFileSafe",
          { path: f.path, mode },
        )) as { ok: boolean; error?: string; size?: number; origSize?: number };
        if (!result.ok) {
          throw new Error(result.error || "unknown error");
        }
        // 重新读取真实文件状态（不依赖 .bak）
        let isDestroyed = mode === "destroy";
        try {
          const inspect = (await (globalThis as any).dartCallNativeAsync(
            "FileObfuscator.inspectFile",
            { path: f.path },
          )) as { ok: boolean; isDestroyed?: boolean };
          if (inspect.ok && typeof inspect.isDestroyed === "boolean") {
            isDestroyed = inspect.isDestroyed;
          }
        } catch (_) {
          // ignore
        }
        updateFile(i, {
          status: "done",
          message: "OK",
          isDestroyed,
        });
        success++;
      } catch (e: any) {
        // 失败时也用真实文件状态更新
        let isDestroyed = false;
        try {
          const inspect = (await (globalThis as any).dartCallNativeAsync(
            "FileObfuscator.inspectFile",
            { path: f.path },
          )) as { ok: boolean; isDestroyed?: boolean };
          if (inspect.ok && typeof inspect.isDestroyed === "boolean") {
            isDestroyed = inspect.isDestroyed;
          }
        } catch (_) {
          // ignore
        }
        updateFile(i, {
          status: "error",
          message: e?.message || String(e),
          isDestroyed,
        });
        fail++;
      }
      done++;
      setProgress({ done, total: targets.length });
    }

    if (interrupted) {
      setStopped(true);
      appendLog(
        `${actionLabel}中断：完成 ${success}/${targets.length}，源文件保持完整`,
      );
      await ToastService.show(`已中断，成功 ${success}`);
    } else {
      appendLog(
        `${actionLabel}完成：成功 ${success}，失败 ${fail}，总计 ${targets.length}`,
      );
      await ToastService.show(`${actionLabel}完成：成功 ${success}`);
    }
    setRunning(false);
  };

  const handleStop = () => {
    if (!running) return;
    stopFlag.current = true;
    appendLog("正在中断...");
    ToastService.show("正在中断，已处理的文件保持完整");
  };

  const handleClear = () => {
    setFiles([]);
    setLog([]);
    setProgress({ done: 0, total: 0 });
  };

  return (
    <Scaffold appBar={<AppBar title="文件破坏/还原工具" />}>
      <Row>
        {/* 左侧：配置区 + 文件列表 */}
        <Expanded>
          <Column>
            {/* 配置区 */}
            <Container
              padding={12}
              decoration={{
                color: "#FFFFFF",
                border: { color: "#E0E0E0", width: 1 },
                borderRadius: 8,
              }}
              margin={12}
            >
              <Column>
                <Text
                  text="配置"
                  fontWeight="bold"
                  fontSize={16}
                  margin={{ bottom: 8 }}
                />
                <Text
                  text="目标目录"
                  fontSize={13}
                  color="#666"
                  margin={{ bottom: 4 }}
                />
                <Row>
                  <Expanded>
                    <TextField
                      hint="例如 /var/mobile/.../Documents"
                      text={dir}
                      onChanged={setDir}
                      maxLines={2}
                    />
                  </Expanded>
                  <SizedBox width={8} />
                  <Button
                    text="📂"
                    onTap={handlePickDirectory}
                    backgroundColor="#1976D2"
                  />
                </Row>
                <SizedBox height={12} />
                <Text
                  text="扩展名过滤（逗号分隔，留空匹配所有）"
                  fontSize={13}
                  color="#666"
                  margin={{ bottom: 4 }}
                />
                <TextField
                  hint="png,mp4,jpg"
                  text={extInput}
                  onChanged={setExtInput}
                />
                <SizedBox height={12} />
                <Row
                  mainAxisAlignment="spaceBetween"
                  crossAxisAlignment="center"
                >
                  <Text
                    text={mode === "destroy" ? "模式：破坏" : "模式：还原"}
                    fontWeight="bold"
                    fontSize={14}
                    color={mode === "destroy" ? "#D32F2F" : "#388E3C"}
                  />
                  <Row crossAxisAlignment="center">
                    <Text
                      text="破坏"
                      fontSize={13}
                      margin={{ right: 6 }}
                      color={mode === "destroy" ? "#D32F2F" : "#999"}
                    />
                    <Switch
                      value={mode === "restore"}
                      onChanged={(v) => setMode(v ? "restore" : "destroy")}
                    />
                    <Text
                      text="还原"
                      fontSize={13}
                      margin={{ left: 6 }}
                      color={mode === "restore" ? "#388E3C" : "#999"}
                    />
                  </Row>
                </Row>
                <SizedBox height={12} />
                <Row mainAxisAlignment="spaceBetween">
                  <Button
                    text={scanning ? "扫描中..." : "扫描文件"}
                    onTap={handleScan}
                    disabled={scanning || running}
                    outlined
                    borderColor="#1976D2"
                    textColor="#1976D2"
                  />
                  <Button
                    text={
                      running
                        ? `处理中 ${progress.done}/${progress.total}`
                        : mode === "destroy"
                          ? "执行破坏"
                          : "执行还原"
                    }
                    onTap={handleExecute}
                    disabled={running || files.length === 0}
                    backgroundColor={mode === "destroy" ? "#D32F2F" : "#388E3C"}
                  />
                  {running ? (
                    <Button
                      text="停止"
                      onTap={handleStop}
                      backgroundColor="#FF6F00"
                      textColor="#FFFFFF"
                    />
                  ) : null}
                </Row>
                {Object.keys(DEFAULT_DIRS).length > 0 ? (
                  <>
                    <SizedBox height={8} />
                    <Text text="快速选择目录：" fontSize={12} color="#666" />
                    <Row mainAxisAlignment="start">
                      {Object.entries(DEFAULT_DIRS).map(([k, v]) => (
                        <InkWell key={k} onTap={() => setDir(v)}>
                          <Container
                            margin={{ right: 6, top: 4 }}
                            padding={{ horizontal: 8, vertical: 4 }}
                            decoration={{
                              color: "#E3F2FD",
                              borderRadius: 4,
                            }}
                          >
                            <Text text={k} fontSize={11} color="#1565C0" />
                          </Container>
                        </InkWell>
                      ))}
                    </Row>
                  </>
                ) : null}
              </Column>
            </Container>
            <Divider />
            {/* 文件列表 */}
            <Padding padding={{ horizontal: 12, vertical: 8 }}>
              <Row mainAxisAlignment="spaceBetween">
                <Text
                  text={`文件列表（${files.length}）`}
                  fontWeight="bold"
                  fontSize={14}
                />
                {files.length > 0 ? (
                  <InkWell onTap={handleClear}>
                    <Container padding={4}>
                      <Text text="清空" fontSize={13} color="#1976D2" />
                    </Container>
                  </InkWell>
                ) : null}
              </Row>
            </Padding>
            <Expanded>
              {files.length === 0 ? (
                <Container
                  padding={20}
                  alignment="center"
                  decoration={{ color: "#FAFAFA" }}
                >
                  <Text text="暂无文件，请先点击「扫描文件」" color="#999" />
                </Container>
              ) : (
                <ListView>
                  {files.map((f, i) => (
                    <Container
                      key={f.path}
                      padding={10}
                      margin={{ horizontal: 12, bottom: 6 }}
                      decoration={{
                        color: "#FFFFFF",
                        border: { color: "#EEEEEE", width: 1 },
                        borderRadius: 6,
                      }}
                    >
                      <Row mainAxisAlignment="spaceBetween">
                        <Column>
                          <Row crossAxisAlignment="center">
                            <Text
                              text={f.name}
                              fontSize={13}
                              fontWeight="bold"
                            />
                            {f.isDestroyed ? (
                              <Container
                                margin={{ left: 6 }}
                                padding={{
                                  horizontal: 6,
                                  vertical: 2,
                                }}
                                decoration={{
                                  color: "#FFEBEE",
                                  borderRadius: 3,
                                }}
                              >
                                <Text
                                  text="已破坏"
                                  fontSize={10}
                                  color="#C62828"
                                />
                              </Container>
                            ) : null}
                          </Row>
                          <Text
                            text={`${(f.size / 1024).toFixed(1)} KB · ${f.path}`}
                            fontSize={11}
                            color="#888"
                            maxLines={1}
                            overflow="ellipsis"
                          />
                          {f.message ? (
                            <Text
                              text={f.message}
                              fontSize={11}
                              color={
                                f.status === "error" ? "#D32F2F" : "#388E3C"
                              }
                            />
                          ) : null}
                        </Column>
                        <StatusBadge status={f.status} />
                      </Row>
                    </Container>
                  ))}
                </ListView>
              )}
            </Expanded>
          </Column>
        </Expanded>
        {/* 右侧：日志区 */}
        <Container
          width={280}
          margin={{ top: 12, bottom: 12, right: 12 }}
          decoration={{
            color: "#263238",
            borderRadius: 8,
          }}
        >
          <Padding padding={10}>
            <Text
              text="日志"
              fontSize={13}
              color="#B0BEC5"
              fontWeight="bold"
              margin={{ bottom: 8 }}
            />
            <Expanded>
              <SingleChildScrollView>
                <Column crossAxisAlignment="start">
                  {log.length === 0 ? (
                    <Text text="暂无日志" fontSize={11} color="#78909C" />
                  ) : (
                    log.map((l, i) => (
                      <Text
                        key={i}
                        text={l}
                        fontSize={11}
                        color="#B0BEC5"
                        margin={{ bottom: 2 }}
                      />
                    ))
                  )}
                </Column>
              </SingleChildScrollView>
            </Expanded>
          </Padding>
        </Container>
      </Row>
    </Scaffold>
  );
}

function StatusBadge({ status }: { status: FileStatus }) {
  const map: Record<FileStatus, { color: string; bg: string; label: string }> =
    {
      pending: { color: "#666", bg: "#EEEEEE", label: "待处理" },
      processing: { color: "#1565C0", bg: "#E3F2FD", label: "处理中" },
      done: { color: "#388E3C", bg: "#E8F5E9", label: "完成" },
      error: { color: "#D32F2F", bg: "#FFEBEE", label: "失败" },
    };
  const s = map[status];
  return (
    <Container
      padding={{ horizontal: 8, vertical: 4 }}
      decoration={{ color: s.bg, borderRadius: 4 }}
    >
      <Text text={s.label} fontSize={11} color={s.color} fontWeight="bold" />
    </Container>
  );
}
