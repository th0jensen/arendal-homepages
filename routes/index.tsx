import { type PageProps, type Handlers } from "$fresh/server.ts";
import CompanyTable from "../islands/CompanyTable.tsx";
import { type Company } from "../types/company.ts";
import { handler as companiesHandler } from "./api/companies.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const resp = await companiesHandler(_req, ctx);
    const companies: Company[] = await resp.json();
    return ctx.render({ companies });
  },
};

export default function Home(props: PageProps<{ companies: Company[] }>) {
  const { companies } = props.data;

  return (
    <div class="min-h-screen p-2 sm:p-4 mx-auto max-w-screen flex flex-col">
      <div class="flex-grow flex items-center justify-center">
        <div class="w-full">
          <h1 class="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">Arendal's Businesses Homepage Availability</h1>
          <CompanyTable companies={companies} />
        </div>
      </div>
    </div>
  );
}
