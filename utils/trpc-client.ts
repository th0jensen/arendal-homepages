import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './trpc.ts';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8000/api/trpc',
    }),
  ],
});