import { HandlerContext } from "$fresh/server.ts";
import type { BrregCompany, Company } from "../../db/schema.ts";
import { db } from "../../db/config.ts";
import { CompanyValidator, BrregCompanyValidator, companySchema } from "../../db/schema.ts";
import { eq } from "drizzle-orm";

function normalizeWebsiteUrl(url: string): string {
  if (!url) return 'No website';
  
  let cleanUrl = url.replace(/^(https?:\/\/)?/, '');
  cleanUrl = cleanUrl.replace(/\/$/, '');
  
  if (!cleanUrl.startsWith('www.')) {
    cleanUrl = 'www.' + cleanUrl;
  }
  
  return 'https://' + cleanUrl;
}

const BRREG_API = "https://data.brreg.no/enhetsregisteret/api/enheter";
const ARENDAL_KOMMUNE = "4203";

async function fetchArendalCompanies() {
  const companies: Company[] = [];
  let page = 0;
  const size = 100;
  
  try {
    while (true) {
      const url = new URL(BRREG_API);
      url.searchParams.append("kommunenummer", ARENDAL_KOMMUNE);
      url.searchParams.append("size", size.toString());
      url.searchParams.append("page", page.toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data._embedded?.enheter) {
        console.error('Invalid API response format');
        break;
      }

      let brregCompanies: BrregCompany[];
      try {
        brregCompanies = data._embedded.enheter.map((company: BrregCompany) => BrregCompanyValidator.parse(company));
      } catch (error) {
        console.error('Data validation error:', error);
        continue;
      }

      if (brregCompanies.length === 0) {
        break;
      }

      for (const company of brregCompanies) {
        if (!company.konkurs && !company.underAvvikling && !company.underTvangsavviklingEllerTvangsopplosning) {
          const companyData = CompanyValidator.parse({
            name: company.navn,
            webpage: company.hjemmeside ? normalizeWebsiteUrl(company.hjemmeside) : 'No website',
            stiftelsesdato: company.stiftelsesdato || "No date found",
            email: company.epostadresse,
            ansatte: company.antallAnsatte || 0,
            businessType: company.organisasjonsform?.beskrivelse || 'Not specified',
            businessTypeCode: company.organisasjonsform?.kode || 'N/A'
          });
          companies.push(companyData);
        }
      }

      page++;
    }
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }

  return companies;
}

async function updateCompaniesCache(companies: Company[]) {
  try {
    await db.delete(companySchema).where(eq(companySchema.name, companySchema.name));
    await db.insert(companySchema).values(companies);
  } catch (error) {
    console.error('Error updating cache:', error);
    throw error;
  }
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
  try {
    // First try to read from cache
    const cachedData = (await db.select().from(companySchema).orderBy(companySchema.name)).filter(company => !company.name.toLowerCase().includes("konkurs"));
    
    if (cachedData && cachedData.length > 0) {
      // Return cached data immediately
      const response = new Response(JSON.stringify(cachedData), {
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "public",
          'Content-Encoding': 'gzip'
        },
      });

      // Then start background refresh
      queueMicrotask(async () => {
        try {
          const freshData = await fetchArendalCompanies();
          await updateCompaniesCache(freshData);
        } catch (error) {
          console.error('Background fetch error:', error);
        }
      });

      return response;
    }

    // If no cache exists, fetch fresh data
    const companies = await fetchArendalCompanies();
    await updateCompaniesCache(companies);

    return new Response(JSON.stringify(companies), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public",
        'Content-Encoding': 'gzip'
      },
    });
  } catch (error) {
    console.error('Error in companies handler:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch companies' }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        'Content-Encoding': 'gzip'
      },
    });
  }
};