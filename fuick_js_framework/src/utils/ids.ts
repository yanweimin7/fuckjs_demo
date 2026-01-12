let idCounter = 0;

export function refsId(seed?: string): string {
  if (seed) {
    return `ref_${seed}`;
  }
  return `ref_${Date.now()}_${idCounter++}`;
}
