import { api } from '@/lib/api-client.';

export async function sessionQuery() {
  return api('/auth/me');
}

export async function logoutMutation() {
  return api('/auth/logout', { method: 'POST' });
}
