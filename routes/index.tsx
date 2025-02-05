import type { PageProps, Handlers } from "$fresh/server.ts";
import { CompanySelect } from "../db/schema.ts";
import CompanyTable from "../islands/CompanyTable.tsx";
import { handler as companiesHandler } from "./api/companies.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const headers = new Headers({
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json'
    });
    const req = new Request(_req, { headers });
    const resp = await companiesHandler(req, ctx);
    const companies: CompanySelect[] = await resp.json();
    return ctx.render({ companies });
  },
};

export default function Home(props: PageProps<{ companies: CompanySelect[]} >) {
  const { companies } = props.data;

  return (
    <div class="min-h-screen p-2 sm:p-4 mx-auto max-w-screen flex flex-col">
      <div class="flex-grow flex items-center justify-center">
        <div class="w-full">
          <h1 class="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center dark:text-gray-300">Arendal's Businesses Homepage Availability</h1>
          <CompanyTable companies={companies.map(company => ({
            ...company,
            lastUpdated: new Date(company.lastUpdated)
          }))} />
        </div>
      </div>
    </div>
  );
}
