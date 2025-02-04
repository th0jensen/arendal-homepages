import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './trpc.ts';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return globalThis.location.origin;
  }
  return 'http://localhost:8000';
};

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});