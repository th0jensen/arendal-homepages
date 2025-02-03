import { HandlerContext } from "$fresh/server.ts";
import { type Company, type BrregCompany } from "../../types/company.ts";
import { ensureFile, exists } from "https://deno.land/std@0.204.0/fs/mod.ts";

function normalizeWebsiteUrl(url: string): string {
  if (!url) return 'No website';
  
  // Remove any existing protocol
  let cleanUrl = url.replace(/^(https?:\/\/)?/, '');
  
  // Remove trailing slashes
  cleanUrl = cleanUrl.replace(/\/$/, '');
  
  // Add www if it's not present and the URL doesn't start with www
  if (!cleanUrl.startsWith('www.')) {
    cleanUrl = 'www.' + cleanUrl;
  }
  
  // Add https protocol
  return 'https://' + cleanUrl;
}

const BRREG_API = "https://data.brreg.no/enhetsregisteret/api/enheter";
const ARENDAL_KOMMUNE = "4203";

async function fetchArendalCompanies(): Promise<Company[]> {
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
      const brregCompanies: BrregCompany[] = data._embedded?.enheter || [];

      if (brregCompanies.length === 0) {
        break;
      }

      for (const company of brregCompanies) {
        if (!company.konkurs || !company.underAvvikling || !company.underTvangsavviklingEllerTvangsopplosning) {
            const webpage = company.hjemmeside
              ? normalizeWebsiteUrl(company.hjemmeside)
              : 'No website';
            companies.push({
              name: company.navn,
              webpage,
              stiftelsesdato: company.stiftelsesdato,
              ansatte: parseInt(company.antallAnsatte) || 0,
              businessType: company.naeringskode1?.beskrivelse || 'Not specified'
            });
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

const CACHE_FILE = "./companies.json";

async function readCache(): Promise<Company[] | null> {
  try {
    if (await exists(CACHE_FILE)) {
      const content = await Deno.readTextFile(CACHE_FILE);
      return JSON.parse(content) as Company[];
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
}

async function writeCache(companies: Company[]): Promise<void> {
  try {
    await ensureFile(CACHE_FILE);
    await Deno.writeTextFile(CACHE_FILE, JSON.stringify(companies, null, 2));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
  try {
    // First try to read from cache synchronously
    const cachedData = await readCache();
    if (cachedData) {
      // Return cached data immediately
      const response = new Response(JSON.stringify(cachedData), {
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, must-revalidate"
        },
      });

      // Then start background refresh
      queueMicrotask(async () => {
        try {
          const freshData = await fetchArendalCompanies();
          await writeCache(freshData);
        } catch (error) {
          console.error('Background fetch error:', error);
        }
      });

      return response;
    }

    // If no cache exists, fetch fresh data
    const companies = await fetchArendalCompanies();
    await writeCache(companies);

    return new Response(JSON.stringify(companies), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, must-revalidate"
      },
    });
  } catch (error) {
    console.error('Error in companies handler:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch companies' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};