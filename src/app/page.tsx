'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [jurisdiction, setJurisdiction] = useState('all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchCases = useCallback(async (searchQuery = '', searchYear = '', searchJurisdiction = 'all') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (searchYear) params.append('year', searchYear);
      if (searchJurisdiction && searchJurisdiction !== 'all') params.append('jurisdiction', searchJurisdiction);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      setResults(data.cases || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  }, []);

  // Automatically fetch cases on page load
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCases(query, year, jurisdiction);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">DEEN LEX</h1>
          <p className="text-gray-600 mt-2 text-base">Intelligent Search for Nigerian and English Case Law</p>
        </div>
        
        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-3 mb-10">
          <input 
            type="text" 
            placeholder="Search case name, citation, or legal principle..." 
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Year (e.g. 2014)" 
            className="w-full md:w-32 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 placeholder-gray-400"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <select 
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
          >
            <option value="all">All Courts</option>
            <option value="nigeria">Nigeria</option>
            <option value="uk">United Kingdom</option>
          </select>
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-sm"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results Container */}
        <div className="space-y-6">
          {results.map((caseItem, index) => (
            <div key={caseItem.id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{caseItem.title}</h2>
                  <p className="text-sm text-gray-500 font-mono mt-1">{caseItem.citation} • {caseItem.year}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  caseItem.jurisdiction === 'Nigeria' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}>
                  {caseItem.jurisdiction}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Summary & Legal Principle</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{caseItem.summary}</p>
              </div>
            </div>
          ))}

          {results.length === 0 && !loading && hasSearched && (
            <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-base font-medium">No matching cases found</p>
              <p className="text-sm text-gray-400 mt-1">Try searching for &quot;Ukeje&quot;, &quot;1989&quot;, or clearing filter parameters.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
