import type { EcosystemAdapter } from './types';

export interface EcosystemSlot {
  id: string;
  label: string;
  description?: string;
  available: boolean;
  adapter?: EcosystemAdapter;
}

class EcosystemRegistry {
  private slots: EcosystemSlot[] = [];

  register(adapter: EcosystemAdapter): void {
    const existing = this.slots.find((s) => s.id === adapter.id);
    if (existing) {
      existing.available = true;
      existing.adapter = adapter;
    } else {
      this.slots.push({
        id: adapter.id,
        label: adapter.label,
        description: adapter.description,
        available: true,
        adapter,
      });
    }
  }

  reserve(id: string, label: string, description?: string): void {
    if (this.slots.find((s) => s.id === id)) return;
    this.slots.push({ id, label, description, available: false });
  }

  getAll(): readonly EcosystemSlot[] {
    return this.slots;
  }

  getDefault(): EcosystemAdapter {
    const first = this.slots.find((s) => s.available);
    if (!first?.adapter) throw new Error('No ecosystem adapter available');
    return first.adapter;
  }
}

export const ecosystemRegistry = new EcosystemRegistry();
