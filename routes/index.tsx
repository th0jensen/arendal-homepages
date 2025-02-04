import { type PageProps } from "$fresh/server.ts";
import CompanyTable from "../islands/CompanyTable.tsx";
import { trpcClient } from "../utils/trpc-client.ts";


export default async function Home(props: PageProps) {
  const companies = await trpcClient.getCompanies.query();

  return (
    <div class="min-h-screen p-2 sm:p-4 mx-auto max-w-screen flex flex-col">
      <div class="flex-grow flex items-center justify-center">
        <div class="w-full">
          <h1 class="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">Arendal's Businesses Homepage Availability</h1>
          <CompanyTable companies={companies.map(company => ({
            ...company,
            lastUpdated: new Date(company.lastUpdated)
          }))} />
        </div>
      </div>
    </div>
  );
}
