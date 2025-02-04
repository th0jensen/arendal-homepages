import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../../../utils/trpc.ts';
import { HandlerContext } from "$fresh/server.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
  const response = await fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
    responseMeta: () => {
      return {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
    },
  });
  return response;
};