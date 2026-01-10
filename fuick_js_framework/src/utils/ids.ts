let idCounter = 0;

export function refsId(): string {
  return `ref_${Date.now()}_${idCounter++}`;
}
