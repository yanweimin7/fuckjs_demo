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
    <Scaffold
      appBar={
        <AppBar
          title={
            <Row crossAxisAlignment="center">
              <Text text="🛡️" fontSize={18} margin={{ right: 8 }} />
              <Text text="文件保护工具" fontSize={16} fontWeight="bold" />
            </Row>
          }
        />
      }
    >
      <Container decoration={{ color: "#0D0D1A" }}>
        <Row>
          {/* 左侧：主面板 */}
          <Expanded>
            <Column>
              {/* ========== 配置卡片 ========== */}
              <Container
                margin={12}
                padding={16}
                decoration={{
                  color: "#1A1A2E",
                  borderRadius: 16,
                  border: { color: "#2A2A4A", width: 1 },
                }}
              >
                <Column>
                  {/* 标题行 */}
                  <Row crossAxisAlignment="center" margin={{ bottom: 16 }}>
                    <Container
                      padding={{ horizontal: 10, vertical: 5 }}
                      decoration={{
                        color:
                          mode === "destroy"
                            ? "rgba(255,92,92,0.15)"
                            : "rgba(76,175,80,0.15)",
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        text={
                          mode === "destroy" ? "🔥 破坏模式" : "✨ 还原模式"
                        }
                        fontSize={13}
                        fontWeight="bold"
                        color={mode === "destroy" ? "#FF5C5C" : "#4CAF50"}
                      />
                    </Container>
                    <SizedBox width={8} />
                    {/* 模式切换 */}
                    <Container
                      decoration={{
                        color: "#222240",
                        borderRadius: 20,
                        border: { color: "#333355", width: 1 },
                      }}
                      padding={{ horizontal: 4, vertical: 3 }}
                    >
                      <Row crossAxisAlignment="center">
                        <InkWell onTap={() => setMode("destroy")}>
                          <Container
                            padding={{ horizontal: 12, vertical: 5 }}
                            decoration={{
                              color:
                                mode === "destroy" ? "#FF5C5C" : "transparent",
                              borderRadius: 16,
                            }}
                          >
                            <Text
                              text="破坏"
                              fontSize={12}
                              fontWeight="bold"
                              color={mode === "destroy" ? "#FFF" : "#666688"}
                            />
                          </Container>
                        </InkWell>
                        <InkWell onTap={() => setMode("restore")}>
                          <Container
                            padding={{ horizontal: 12, vertical: 5 }}
                            decoration={{
                              color:
                                mode === "restore" ? "#4CAF50" : "transparent",
                              borderRadius: 16,
                            }}
                          >
                            <Text
                              text="还原"
                              fontSize={12}
                              fontWeight="bold"
                              color={mode === "restore" ? "#FFF" : "#666688"}
                            />
                          </Container>
                        </InkWell>
                      </Row>
                    </Container>
                  </Row>

                  {/* 目录输入 */}
                  <Text
                    text="📁 目标目录"
                    fontSize={12}
                    color="#8888AA"
                    fontWeight="bold"
                    margin={{ bottom: 6 }}
                  />
                  <Row>
                    <Expanded>
                      <Container
                        decoration={{
                          color: "#222240",
                          borderRadius: 12,
                          border: { color: "#333355", width: 1 },
                        }}
                        padding={{ left: 12, right: 4, top: 2, bottom: 2 }}
                      >
                        <TextField
                          hint="输入或选择目录路径"
                          text={dir}
                          onChanged={setDir}
                          maxLines={1}
                        />
                      </Container>
                    </Expanded>
                    <SizedBox width={8} />
                    <Button
                      text="📂"
                      onTap={handlePickDirectory}
                      backgroundColor="#6C63FF"
                      textColor="#FFF"
                    />
                  </Row>

                  <SizedBox height={14} />

                  {/* 扩展名过滤 */}
                  <Text
                    text="🔍 扩展名过滤"
                    fontSize={12}
                    color="#8888AA"
                    fontWeight="bold"
                    margin={{ bottom: 6 }}
                  />
                  <Container
                    decoration={{
                      color: "#222240",
                      borderRadius: 12,
                      border: { color: "#333355", width: 1 },
                    }}
                    padding={{ left: 12, right: 4, top: 2, bottom: 2 }}
                  >
                    <TextField
                      hint="png, mp4, jpg..."
                      text={extInput}
                      onChanged={setExtInput}
                    />
                  </Container>

                  {/* 快速选择目录 */}
                  {Object.keys(DEFAULT_DIRS).length > 0 ? (
                    <>
                      <SizedBox height={14} />
                      <Text
                        text="⚡ 快速选择"
                        fontSize={12}
                        color="#8888AA"
                        fontWeight="bold"
                        margin={{ bottom: 6 }}
                      />
                      <Row mainAxisAlignment="start">
                        {Object.entries(DEFAULT_DIRS).map(([k, v]) => (
                          <InkWell key={k} onTap={() => setDir(v)}>
                            <Container
                              margin={{ right: 6, bottom: 4 }}
                              padding={{ horizontal: 12, vertical: 6 }}
                              decoration={{
                                color: "#6C63FF",
                                borderRadius: 20,
                              }}
                            >
                              <Text
                                text={k}
                                fontSize={12}
                                color="#FFFFFF"
                                fontWeight="bold"
                              />
                            </Container>
                          </InkWell>
                        ))}
                      </Row>
                    </>
                  ) : null}

                  <SizedBox height={16} />

                  {/* 操作按钮行 */}
                  <Row mainAxisAlignment="spaceBetween">
                    <Button
                      text={scanning ? "⏳ 扫描中..." : "🔎 扫描文件"}
                      onTap={handleScan}
                      disabled={scanning || running}
                      outlined
                      borderColor="#6C63FF"
                      textColor="#6C63FF"
                    />
                    {running ? (
                      <Button
                        text="⏹ 停止"
                        onTap={handleStop}
                        backgroundColor="#FF6F00"
                        textColor="#FFFFFF"
                      />
                    ) : null}
                    <Button
                      text={
                        running
                          ? `⏳ ${progress.done}/${progress.total}`
                          : mode === "destroy"
                            ? "💥 执行破坏"
                            : "♻️ 执行还原"
                      }
                      onTap={handleExecute}
                      disabled={running || files.length === 0}
                      backgroundColor={
                        mode === "destroy" ? "#FF5C5C" : "#4CAF50"
                      }
                      textColor="#FFFFFF"
                    />
                  </Row>
                </Column>
              </Container>

              {/* ========== 文件列表（Expanded 确保有界高度） ========== */}
              <Expanded>
                <Container
                  margin={{ left: 12, right: 12, top: 0, bottom: 12 }}
                  padding={16}
                  decoration={{
                    color: "#1A1A2E",
                    borderRadius: 16,
                    border: { color: "#2A2A4A", width: 1 },
                  }}
                >
                  <Column>
                    {/* 列表标题栏 */}
                    <Row
                      mainAxisAlignment="spaceBetween"
                      crossAxisAlignment="center"
                      margin={{ bottom: 12 }}
                    >
                      <Row crossAxisAlignment="center">
                        <Text text="📄" fontSize={16} margin={{ right: 8 }} />
                        <Text
                          text={`文件列表`}
                          fontSize={15}
                          fontWeight="bold"
                          color="#EEE"
                        />
                        <Container
                          margin={{ left: 8 }}
                          padding={{ horizontal: 8, vertical: 3 }}
                          decoration={{
                            color: "#6C63FF",
                            borderRadius: 12,
                          }}
                        >
                          <Text
                            text={`${files.length}`}
                            fontSize={11}
                            fontWeight="bold"
                            color="#FFF"
                          />
                        </Container>
                      </Row>
                      {files.length > 0 ? (
                        <InkWell onTap={handleClear}>
                          <Container
                            padding={{ horizontal: 10, vertical: 5 }}
                            decoration={{
                              color: "rgba(255,255,255,0.05)",
                              borderRadius: 8,
                            }}
                          >
                            <Text
                              text="🗑️ 清空"
                              fontSize={12}
                              color="#8888AA"
                            />
                          </Container>
                        </InkWell>
                      ) : null}
                    </Row>

                    {/* 进度条 */}
                    {running || progress.total > 0 ? (
                      <Container
                        height={4}
                        margin={{ bottom: 10 }}
                        decoration={{
                          color: "#222240",
                          borderRadius: 2,
                        }}
                      >
                        <Container
                          width={
                            progress.total > 0
                              ? Math.round(
                                  (progress.done / progress.total) * 100,
                                )
                              : 0
                          }
                          height={4}
                          decoration={{
                            color: mode === "destroy" ? "#FF5C5C" : "#4CAF50",
                            borderRadius: 2,
                          }}
                        />
                      </Container>
                    ) : null}

                    {/* 列表内容 */}
                    <Expanded>
                      {files.length === 0 ? (
                        <Container
                          padding={30}
                          alignment="center"
                          decoration={{
                            color: "#222240",
                            borderRadius: 12,
                          }}
                        >
                          <Text
                            text="📂"
                            fontSize={36}
                            margin={{ bottom: 10 }}
                          />
                          <Text
                            text="暂无文件"
                            fontSize={16}
                            fontWeight="bold"
                            color="#666688"
                          />
                          <Text
                            text="选择目录后点击「扫描文件」开始"
                            fontSize={12}
                            color="#555577"
                            margin={{ top: 4 }}
                          />
                        </Container>
                      ) : (
                        <ListView>
                          {files.map((f, i) => {
                            const ext =
                              f.name.lastIndexOf(".") >= 0
                                ? f.name
                                    .substring(f.name.lastIndexOf(".") + 1)
                                    .toLowerCase()
                                : "";
                            const iconMap: Record<string, string> = {
                              png: "🖼️",
                              jpg: "🖼️",
                              jpeg: "🖼️",
                              gif: "🖼️",
                              webp: "🖼️",
                              mp4: "🎬",
                              mov: "🎬",
                              avi: "🎬",
                              mp3: "🎵",
                              wav: "🎵",
                              aac: "🎵",
                              m4a: "🎵",
                              pdf: "📄",
                              doc: "📝",
                              docx: "📝",
                              txt: "📃",
                            };
                            const icon = iconMap[ext] || "📄";
                            return (
                              <Container
                                key={f.path}
                                padding={12}
                                margin={{ bottom: 6 }}
                                decoration={{
                                  color: "#222240",
                                  borderRadius: 12,
                                  border: {
                                    color:
                                      f.status === "processing"
                                        ? "#6C63FF"
                                        : f.status === "error"
                                          ? "#FF5C5C"
                                          : "transparent",
                                    width: 1,
                                  },
                                }}
                              >
                                <Row mainAxisAlignment="spaceBetween">
                                  {/* 左侧：图标 + 信息 */}
                                  <Row>
                                    {/* 文件类型图标 */}
                                    <Container
                                      width={40}
                                      height={40}
                                      alignment="center"
                                      decoration={{
                                        color: f.isDestroyed
                                          ? "rgba(255,92,92,0.12)"
                                          : "rgba(108,99,255,0.12)",
                                        borderRadius: 10,
                                      }}
                                    >
                                      <Text text={icon} fontSize={20} />
                                    </Container>
                                    <SizedBox width={10} />
                                    <Column>
                                      <Row crossAxisAlignment="center">
                                        <Text
                                          text={f.name}
                                          fontSize={13}
                                          fontWeight="bold"
                                          color="#DDD"
                                        />
                                        {f.isDestroyed ? (
                                          <Container
                                            margin={{ left: 6 }}
                                            padding={{
                                              horizontal: 6,
                                              vertical: 2,
                                            }}
                                            decoration={{
                                              color: "rgba(255,92,92,0.2)",
                                              borderRadius: 4,
                                            }}
                                          >
                                            <Text
                                              text="已破坏"
                                              fontSize={9}
                                              color="#FF5C5C"
                                              fontWeight="bold"
                                            />
                                          </Container>
                                        ) : null}
                                      </Row>
                                      <Text
                                        text={`${(f.size / 1024).toFixed(1)} KB`}
                                        fontSize={11}
                                        color="#666688"
                                        margin={{ top: 2 }}
                                      />
                                      {f.message ? (
                                        <Text
                                          text={f.message}
                                          fontSize={10}
                                          color={
                                            f.status === "error"
                                              ? "#FF5C5C"
                                              : "#4CAF50"
                                          }
                                          margin={{ top: 1 }}
                                        />
                                      ) : null}
                                    </Column>
                                  </Row>
                                  {/* 右侧：状态徽章 */}
                                  <StatusBadge status={f.status} />
                                </Row>
                              </Container>
                            );
                          })}
                        </ListView>
                      )}
                    </Expanded>
                  </Column>
                </Container>
              </Expanded>
            </Column>
          </Expanded>

          {/* ========== 右侧日志面板 ========== */}
          <Container
            width={260}
            margin={{ top: 12, bottom: 12, right: 12 }}
            padding={14}
            decoration={{
              color: "#111122",
              borderRadius: 16,
              border: { color: "#2A2A4A", width: 1 },
            }}
          >
            <Column>
              {/* 日志标题 */}
              <Row crossAxisAlignment="center" margin={{ bottom: 10 }}>
                <Text text="📋" fontSize={14} margin={{ right: 6 }} />
                <Text
                  text="运行日志"
                  fontSize={13}
                  color="#8888AA"
                  fontWeight="bold"
                />
                <SizedBox width={6} />
                <Container
                  width={6}
                  height={6}
                  decoration={{
                    color: "#4CAF50",
                    borderRadius: 3,
                  }}
                />
              </Row>

              <Divider />

              {/* 日志内容 */}
              <Expanded>
                <SingleChildScrollView>
                  <Column crossAxisAlignment="start">
                    {log.length === 0 ? (
                      <Container padding={20} alignment="center">
                        <Text
                          text="等待操作..."
                          fontSize={11}
                          color="#444466"
                        />
                      </Container>
                    ) : (
                      log.map((l, i) => (
                        <Container
                          key={i}
                          padding={{ top: 4, bottom: 4, left: 4, right: 4 }}
                          margin={{ top: 2 }}
                          decoration={{
                            color:
                              i === 0 ? "rgba(108,99,255,0.08)" : "transparent",
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            text={l}
                            fontSize={11}
                            color={i === 0 ? "#B0B0D0" : "#666688"}
                          />
                        </Container>
                      ))
                    )}
                  </Column>
                </SingleChildScrollView>
              </Expanded>
            </Column>
          </Container>
        </Row>
      </Container>
    </Scaffold>
  );
}

function StatusBadge({ status }: { status: FileStatus }) {
  const map: Record<
    FileStatus,
    {
      color: string;
      bg: string;
      label: string;
      dot: string;
    }
  > = {
    pending: {
      color: "#8888AA",
      bg: "rgba(136,136,170,0.12)",
      label: "待处理",
      dot: "#8888AA",
    },
    processing: {
      color: "#6C63FF",
      bg: "rgba(108,99,255,0.15)",
      label: "处理中",
      dot: "#6C63FF",
    },
    done: {
      color: "#4CAF50",
      bg: "rgba(76,175,80,0.15)",
      label: "完成",
      dot: "#4CAF50",
    },
    error: {
      color: "#FF5C5C",
      bg: "rgba(255,92,92,0.15)",
      label: "失败",
      dot: "#FF5C5C",
    },
  };
  const s = map[status];
  return (
    <Container
      padding={{ horizontal: 10, vertical: 5 }}
      decoration={{ color: s.bg, borderRadius: 20 }}
    >
      <Row crossAxisAlignment="center">
        <Container
          width={6}
          height={6}
          margin={{ right: 5 }}
          decoration={{ color: s.dot, borderRadius: 3 }}
        />
        <Text text={s.label} fontSize={11} color={s.color} fontWeight="bold" />
      </Row>
    </Container>
  );
}
