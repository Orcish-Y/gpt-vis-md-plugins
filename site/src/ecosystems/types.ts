export interface EcosystemAdapter {
  id: string;
  label: string;
  description?: string;
  process(markdown: string): Promise<string> | string;
}
