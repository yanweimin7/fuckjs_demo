export interface WidgetMetadata {
  name: string;
  isBoundary: boolean;
  events?: string[];
}

const registry: Record<string, WidgetMetadata> = {};

export function registerWidget(metadata: WidgetMetadata) {
  registry[metadata.name] = metadata;
}

export function getWidgetMetadata(name: string): WidgetMetadata | undefined {
  return registry[name];
}

export function isBoundaryWidget(name: string): boolean {
  return registry[name]?.isBoundary ?? false;
}
