import { CATEGORY_CONFIG } from '../constants';

const FLAG = {
  EU: '🇪🇺', FR: '🇫🇷', GB: '🇬🇧', ES: '🇪🇸', PT: '🇵🇹',
  US: '🇺🇸', NL: '🇳🇱', DE: '🇩🇪', FI: '🇫🇮', AU: '🇦🇺', CH: '🇨🇭', BM: '🇧🇲',
};

export default function CompanyPanel({ company, onClose }) {
  if (!company) return null;
  const cfg = CATEGORY_CONFIG[company.category];

  return (
    <aside className="w-full md:w-80 lg:w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col overflow-y-auto shrink-0">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{FLAG[company.country] ?? '🌍'}</span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{company.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-gray-400">{company.region}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none mt-0.5"
          aria-label="Close panel"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{company.description}</p>

        {company.relevance && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 p-3">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1 uppercase tracking-wide">
              Por qué es relevante
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{company.relevance}</p>
          </div>
        )}

        {/* Tags */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {company.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href={company.careers}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: cfg.color }}
        >
          Ver carreras
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
