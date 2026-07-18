import { CheckCircle, MapPin, Calendar, Home, Users2 } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const services = [
  { icon: MapPin,    title: 'Customized Itineraries', desc: 'Plan your perfect trip' },
  { icon: Calendar,  title: 'Flexible Scheduling',    desc: 'Travel at your own pace' },
  { icon: Home,      title: 'Complete Packages',      desc: 'Accommodation and meals included' },
  { icon: Users2,    title: 'Group & Solo Tours',     desc: 'Options for everyone' },
];

function TourCard({ pkg, whatsapp }) {
  const highlights = Array.isArray(pkg.highlights)
    ? pkg.highlights
    : (pkg.highlights ? pkg.highlights.split(',').map(s => s.trim()) : []);

  const waMessage = `Hi! I'm interested in booking the ${pkg.title} tour package.`;
  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="card tour-card" style={{ backgroundImage: `url('${pkg.img || 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/skardu.webp'}')` }}>
      <div className="card-content">
        <h3>{pkg.title}</h3>
        <p className="tour-days">{pkg.duration || pkg.days || 'Flexible Duration'}</p>
        <div className="tour-price">
          <span className="label">Starting from</span>
          <h4 className="amount">PKR {Number(pkg.price || 0).toLocaleString('en-PK')}</h4>
          <span className="pax">for {pkg.persons || 2} persons</span>
        </div>
        <ul className="tour-highlights">
          {highlights.map((h, i) => (
            <li key={i}><CheckCircle size={14} /> {h}</li>
          ))}
        </ul>
        <a
          href={waUrl}
          target="_blank" rel="noreferrer"
          className="btn btn-primary btn-block"
        >Book This Package</a>
      </div>
    </div>
  );
}

export default function Tours() {
  const { tours, settings } = useAdmin();
  const whatsapp = settings?.whatsapp || '923182277086';
  const activeTours = tours.filter(t => t.status === 'active');

  return (
    <section id="tours" className="section bg-light">
      <div className="container">
        <div className="section-header text-center">
          <h2>Tour &amp; Travel Services in Skardu &amp; Hunza</h2>
          <p>Explore the best of Gilgit-Baltistan including K2 Base Camp, Deosai, Basho Valley, Nangma Valley, and Hushe with our expert tour guides.</p>
        </div>

        <div className="grid grid-4 mb-section">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="service-icon-box">
                <div className="icon-circle"><Icon size={22} /></div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            );
          })}
        </div>

        <h3 className="text-center mb-md">Popular Tour Packages</h3>
        <div className="grid grid-3">
          {activeTours.map((pkg) => <TourCard key={pkg.id} pkg={pkg} whatsapp={whatsapp} />)}
          {activeTours.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b', fontWeight: '500' }}>
              No tour packages available at the moment.
            </div>
          )}
        </div>

        <div className="cta-banner mt-section">
          <h3>Need a Custom Tour Plan?</h3>
          <p>We specialize in creating personalized itineraries tailored to your preferences and schedule</p>
          <div className="cta-features">
            <span>Corporate Groups</span>
            <span>Family Holidays</span>
            <span>Adventure Seekers</span>
          </div>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-white">Plan My Custom Tour</a>
        </div>
      </div>
    </section>
  );
}
