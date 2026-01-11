import { api } from '@/lib/api-client.';
import type { PeakHours, Stats, Timeline } from '@formaire/shared';

export async function getTimeline(formId: string): Promise<Timeline> {
  return api(`/analytics/${formId}/timeline`);
}

export async function getStats(formId: string): Promise<Stats> {
  return api(`/analytics/${formId}/stats`);
}

export async function getPeakHours(formId: string): Promise<PeakHours> {
  return api(`/analytics/${formId}/peak-hours`);
}
