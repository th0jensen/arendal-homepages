import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './trpc.ts';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getBaseUrl() + '/api/trpc',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }),
  ],
});

function getBaseUrl() {
  if (typeof globalThis.location !== 'undefined') return globalThis.location.origin
  if (Deno.env.get("DEPLOY_URL")) return `https://${Deno.env.get("DEPLOY_URL")}`
  return `http://localhost:${Deno.env.get("PORT") ?? 8000}`
}
