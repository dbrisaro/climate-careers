import { useState, useMemo, useEffect } from 'react';
import companiesData from './companies.json';
import { CATEGORY_CONFIG } from './constants';
import FilterBar from './components/FilterBar';
import ScatterMap from './components/ScatterMap';
import CompanyPanel from './components/CompanyPanel';
import LandscapeView from './components/LandscapeView';
import './index.css';

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG);
const ALL_REGIONS = ['Europe', 'USA', 'Remote'];

const DEFAULT_FILTERS = {
  search: '',
  categories: ALL_CATEGORIES,
  regions: ALL_REGIONS,
};

export default function App() {
  const [tab, setTab] = useState('map');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return companiesData.filter((c) => {
      if (!filters.categories.includes(c.category)) return false;
      if (!filters.regions.includes(c.region) && !filters.regions.includes('Remote')) return false;
      if (q) {
        const inName = c.name.toLowerCase().includes(q);
        const inTags = c.tags.some((t) => t.toLowerCase().includes(q));
        const inDesc = c.description.toLowerCase().includes(q);
        if (!inName && !inTags && !inDesc) return false;
      }
      return true;
    });
  }, [filters]);

  const handleSelect = (company) => {
    setSelected(company);
    if (company && tab === 'landscape') setTab('map');
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
        {/* Top nav */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              CR
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-tight">
                Climate Industry Landscape
              </h1>
              <p className="text-xs text-gray-400 leading-tight hidden sm:block">
                EO · Physical risk · Parametric insurance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {['map', 'landscape'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-xs px-3 py-1.5 font-medium transition-colors capitalize ${
                    tab === t
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {t === 'map' ? 'Map' : 'Landscape'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDarkMode((d) => !d)}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {tab === 'map' && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}

        {/* Main content */}
        <main className="flex flex-1 overflow-hidden">
          {tab === 'map' ? (
            <>
              <div className="flex-1 p-2 sm:p-4 min-w-0 flex flex-col">
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: cfg.color }} />
                      {cfg.label}
                    </div>
                  ))}
                  <span className="text-xs text-gray-400 ml-auto">
                    {filtered.length} / {companiesData.length}
                  </span>
                </div>
                {/* Scatter plot — hidden on mobile */}
                <div className="hidden md:block flex-1" style={{ minHeight: 340 }}>
                  <ScatterMap companies={filtered} selected={selected} onSelect={setSelected} />
                </div>
                {/* Mobile list */}
                <div className="md:hidden flex flex-col gap-1 overflow-y-auto">
                  {filtered.map((c) => {
                    const cfg = CATEGORY_CONFIG[c.category];
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelected(selected?.name === c.name ? null : c)}
                        className="flex items-center gap-3 px-3 py-2.5 text-left rounded-lg hover:bg-white dark:hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">{c.name}</p>
                          <p className="text-xs text-gray-400 truncate">{c.description}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{c.region}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selected && (
                <CompanyPanel company={selected} onClose={() => setSelected(null)} />
              )}
            </>
          ) : (
            <>
              <LandscapeView onSelect={handleSelect} />
              {selected && (
                <CompanyPanel company={selected} onClose={() => setSelected(null)} />
              )}
            </>
          )}
        </main>
    </div>
  );
}
