import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../utils/trpc.ts';
import { HandlerContext } from "$fresh/server.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
  return await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};