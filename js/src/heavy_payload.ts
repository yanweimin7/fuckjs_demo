import { ALL_DATA } from './large_data';

/**
 * 这是一个为了增加 bundle 体积而创建的冗余文件。
 */

export function heavyPayload() {
    // 强制引用，防止 tree-shaking
    const count = ALL_DATA.length;
    let totalSize = 0;
    for (const d of ALL_DATA) {
        totalSize += d.length;
    }
}
