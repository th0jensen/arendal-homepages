import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './trpc.ts';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getBaseUrl() + '/api/trpc',
      headers: {
        'Content-Type': 'application/json',
        "Cache-Control": "no-cache, public, must-revalidate, max-age=0",
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=5, max=1000',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }),
  ],
});

function getBaseUrl() {
  if (typeof globalThis.location !== 'undefined') return globalThis.location.origin
  if (Deno.env.get("DEPLOY_URL")) return `https://${Deno.env.get("DEPLOY_URL")}`
  return `http://localhost:${Deno.env.get("PORT") ?? 8000}`
}
