import { type CompanySelect as Company } from "../db/schema.ts";
import { humanReadableTimestamp } from "jsr:@blaze/human-readable-timestamp";
import { useSignal } from "@preact/signals";

export default function CompanyTable({ companies = [] }: { companies: Company[] }) {
  const searchText = useSignal('');
  const currentFilter = useSignal('all');
  const businessTypeFilter = useSignal('all');
  const sortColumn = useSignal<keyof Company | null>(null);
  const sortDirection = useSignal<'asc' | 'desc'>('asc');

  const getUniqueBusinessTypes = () => {
    if (!Array.isArray(companies)) return ['all'];
    const types = Array.from(new Set(companies.map(company => company.businessType || 'Unknown'))).sort();
    return ['all', ...types];
  };

  const filteredData = () => {
    if (!Array.isArray(companies)) return [];
    let filtered = [...companies];
    
    if (currentFilter.value === 'with') {
      filtered = filtered.filter(company => company.webpage !== 'No website');
    } else if (currentFilter.value === 'without') {
      filtered = filtered.filter(company => company.webpage === 'No website');
    }

    if (businessTypeFilter.value !== 'all') {
      filtered = filtered.filter(company => 
        (company.businessType || 'Unknown') === businessTypeFilter.value
      );
    }

    if (searchText.value) {
      const query = searchText.value.toLowerCase();
      filtered = filtered.filter(company => 
        Object.values(company).some(value => 
          value?.toString().toLowerCase().includes(query)
        )
      );
    }

    if (sortColumn.value) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn.value as keyof Company];
        const bValue = b[sortColumn.value as keyof Company];
        
        if (sortColumn.value === 'stiftelsesdato') {
          if (aValue === 'No date found' && bValue === 'No date found') return 0;
          if (aValue === 'No date found') return 1;
          if (bValue === 'No date found') return 1;
          
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortDirection.value === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        if (sortColumn.value === 'ansatte') {
          const numA = typeof aValue === 'number' ? aValue : 0;
          const numB = typeof bValue === 'number' ? bValue : 0;
          return sortDirection.value === 'asc' ? numA - numB : numB - numA;
        }

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortDirection.value === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  };

  const handleSort = (column: keyof Company) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };

  const handleFilterClick = (filterValue: string) => {
    currentFilter.value = filterValue;
  };

  const data = filteredData();

  return (
    <div class="w-full">
      <div class="sticky top-0 bg-white z-20 mb-4">
        <div class="w-full flex flex-col sm:flex-row justify-between items-stretch gap-4 p-4">
          <input
            type="text"
            value={searchText.value}
            onInput={(e) => searchText.value = (e.target as HTMLInputElement).value}
            placeholder={`Search ${data.length} companies...`}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div class="flex gap-2 w-full sm:w-auto sm:flex-nowrap">
            <button
              onClick={() => handleFilterClick('all')}
              class={`px-4 py-2 rounded-lg border flex-1 sm:w-24 ${currentFilter.value === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterClick('with')}
              class={`px-4 py-2 rounded-lg border flex-1 sm:w-24 ${currentFilter.value === 'with' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Websites
            </button>
            <button
              onClick={() => handleFilterClick('without')}
              class={`px-4 py-2 rounded-lg border flex-1 sm:w-24 ${currentFilter.value === 'without' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              None
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto relative">
        <table class="min-w-full bg-white border border-gray-300 p-4">
          <thead class="bg-gray-100 sticky z-10">
            <tr>
              <th 
                class="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200 w-[15%]"
                onClick={() => handleSort('name')}
              >
                Company Name
                {sortColumn.value === 'name' && (
                  <span class="ml-2">{sortDirection.value === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                class="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200 w-[15%]"
                onClick={() => handleSort('webpage')}
              >
                Website
                {sortColumn.value === 'webpage' && (
                  <span class="ml-2">{sortDirection.value === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                class="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200 w-[12%]"
                onClick={() => handleSort('stiftelsesdato')}
              >
                Establishment Date
                {sortColumn.value === 'stiftelsesdato' && (
                  <span class="ml-2">{sortDirection.value === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                class="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200 w-[8%]"
                onClick={() => handleSort('ansatte')}
              >
                Employees
                {sortColumn.value === 'ansatte' && (
                  <span class="ml-2">{sortDirection.value === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th class="px-6 py-3 border-b text-left w-[30%]">
                <select
                  value={businessTypeFilter.value}
                  onChange={(e: Event) => businessTypeFilter.value = (e.target as HTMLSelectElement).value}
                  class="bg-transparent border-none cursor-pointer focus:outline-none w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {getUniqueBusinessTypes().map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Business Types' : type}
                    </option>
                  ))}
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((company) => (
              <tr key={company.id} class={`hover:bg-gray-50 ${company.webpage !== 'No website' ? 'bg-blue-50' : ''}`}>
                <td class="px-6 py-4 border-b">
                  {company.name}
                </td>
                <td class="px-6 py-4 border-b">
                  {company.webpage === 'No website' ? (
                    company.webpage
                  ) : (
                    <a href={company.webpage} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline truncate block max-w-[18ch]">
                      {company.webpage.replace('https://www.', '')}
                    </a>
                  )}
                </td>
                <td class="px-6 py-4 border-b">
                  {company.stiftelsesdato !== "No date found" ? 
                    humanReadableTimestamp(new Date(company.stiftelsesdato)) : 
                    'No date found'}
                </td>
                <td class="px-6 py-4 border-b">
                  {company.ansatte}
                </td>
                <td class="px-6 py-4 border-b">
                  {company.businessType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
