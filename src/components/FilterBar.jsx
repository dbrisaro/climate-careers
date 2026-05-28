import { CATEGORY_CONFIG } from '../constants';

const REGIONS = ['Europe', 'USA', 'Remote'];

export default function FilterBar({ filters, onChange }) {
  const toggle = (key, value) => {
    const current = filters[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="flex flex-wrap gap-4 items-start px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 min-w-48">
        <input
          type="text"
          placeholder="Search company or tag…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mr-1">Category</span>
        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
          const active = filters.categories.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggle('categories', key)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                active
                  ? 'border-transparent text-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
              }`}
              style={active ? { backgroundColor: cfg.color } : {}}
            >
              {cfg.short}
            </button>
          );
        })}
      </div>

      {/* Region filters */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide mr-1">Region</span>
        {REGIONS.map((r) => {
          const active = filters.regions.includes(r);
          return (
            <button
              key={r}
              onClick={() => toggle('regions', r)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                active
                  ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-transparent'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      {(filters.search || filters.categories.length < 5 || filters.regions.length < 3) && (
        <button
          onClick={() =>
            onChange({
              search: '',
              categories: Object.keys(CATEGORY_CONFIG),
              regions: REGIONS,
            })
          }
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
        >
          Reset
        </button>
      )}
    </div>
  );
}
