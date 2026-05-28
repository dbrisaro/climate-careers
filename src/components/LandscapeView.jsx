import { ARCHETYPES, CATEGORY_CONFIG } from '../constants';
import companiesData from '../companies.json';

const FLAG = {
  EU: '🇪🇺', FR: '🇫🇷', GB: '🇬🇧', ES: '🇪🇸', PT: '🇵🇹',
  US: '🇺🇸', NL: '🇳🇱', DE: '🇩🇪', FI: '🇫🇮', AU: '🇦🇺', CH: '🇨🇭', BM: '🇧🇲',
};

function CompanyCard({ company, onSelect }) {
  const cfg = CATEGORY_CONFIG[company.category];
  return (
    <button
      onClick={() => onSelect(company)}
      className="text-left p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 transition-colors group"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm text-gray-900 dark:text-gray-50 flex items-center gap-1.5">
          <span>{FLAG[company.country] ?? '🌍'}</span>
          {company.name}
        </span>
        <span className="text-xs text-gray-400">{company.region}</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">{company.description}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {company.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-mono">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

export default function LandscapeView({ onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Landscape</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Companies grouped by archetype. Click any card to see details.
        </p>
      </div>

      {ARCHETYPES.map((archetype) => {
        const companies = companiesData.filter((c) => c.category === archetype.id);
        return (
          <section key={archetype.id}>
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-1 rounded-full mt-1 shrink-0 self-stretch min-h-full"
                style={{ backgroundColor: archetype.color, minHeight: '2.5rem' }}
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{archetype.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{archetype.subtitle}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{archetype.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-4">
              {companies.map((c) => (
                <CompanyCard key={c.name} company={c} onSelect={onSelect} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
