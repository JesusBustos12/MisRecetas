'use client';
import { useAppContext } from '@/context/AppContext';
import { COUNTRIES } from '@/constants';

export default function CountryBrowser() {
  const { t, activeCategory, setActiveCategory } = useAppContext();

  return (
    <section className="country-section">
      <div className="country-header">
        <h2>{t.home?.browse_country || 'Browse by Country'}</h2>
      </div>
      <div className="country-list">
        {COUNTRIES.map((country) => (
          <div
            key={country.name}
            className={`country-item ${activeCategory === country.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === country.name ? '' : country.name)}
          >
            <img src={country.img} alt={country.name} className="country-item-img" />
            <span className="country-item-name">{t.countries?.[country.name] || country.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
