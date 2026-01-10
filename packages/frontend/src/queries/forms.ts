import { api } from '@/lib/api-client.';
import type { Form } from '@formaire/shared';

export async function getForms(): Promise<Form[]> {
  return api('/forms');
}
