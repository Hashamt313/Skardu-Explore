import { Users, Fuel } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const features = [
  { icon: '🛡️', title: 'Well-Maintained',      desc: 'Regular servicing and quality checks' },
  { icon: '👤', title: 'Professional Drivers',  desc: 'Experienced local drivers included' },
  { icon: '✅', title: 'Fully Insured',         desc: 'Complete insurance coverage included' },
];

function VehicleCard({ v, whatsapp }) {
  const fallbackImg = 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/Corolla%20.jpg';
  const waUrl = `https://wa.me/${whatsapp}?text=Hi!%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(v.name)}.`;
  
  return (
    <div className="card vehicle-card">
      <div className="card-img">
        <img loading="lazy" src={v.img || fallbackImg} alt={v.name} />
        <div className="card-overlay">
          <a href={waUrl} className="btn btn-primary" target="_blank" rel="noreferrer">Book Now</a>
        </div>
      </div>
      <div className="card-content">
        <h3>{v.name}</h3>
        <p className="subtitle">{v.year || 'Standard Model'}</p>
        <div className="vehicle-info">
          <span><Users size={14} /> {v.passengers || '4'} Passengers</span>
          <span><Fuel size={14} /> {v.fuel || 'Petrol'}</span>
        </div>
        <div className="price-tag">
          <span className="amount">PKR {Number(v.price || 0).toLocaleString('en-PK')}</span>
          <span className="unit">/day</span>
        </div>
        <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-block">Book via WhatsApp</a>
      </div>
    </div>
  );
}

export default function Fleet() {
  const { fleet, settings } = useAdmin();
  const whatsapp = settings?.whatsapp || '923182277086';

  return (
    <section id="fleet" className="section">
      <div className="container">
        <div className="section-header text-center">
          <h2>Our Premium Fleet</h2>
          <p>Choose from our well-maintained collection of vehicles</p>
        </div>

        <div className="grid grid-3">
          {fleet.map((v) => <VehicleCard key={v.id} v={v} whatsapp={whatsapp} />)}
          {fleet.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#64748b', fontWeight: '500' }}>
              No vehicles available at the moment.
            </div>
          )}
        </div>

        <div className="fleet-features grid grid-3 mt-section">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className="icon-circle">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
