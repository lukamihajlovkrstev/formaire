import { api } from '@/lib/api-client.';
import type { CreateFormInput, Form } from '@formaire/shared';

export async function getForms(): Promise<Form[]> {
  return api('/forms');
}

export async function createForm(data: CreateFormInput): Promise<Form> {
  return api('/forms', { method: 'POST', body: JSON.stringify(data) });
}
