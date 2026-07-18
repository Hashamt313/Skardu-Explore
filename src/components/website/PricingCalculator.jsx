import { useState } from 'react';
import { Calculator, Check, Lightbulb, MessageCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const pkr = (n) => 'PKR ' + Number(n).toLocaleString('en-PK');

export default function PricingCalculator() {
  const [selectedIdx, setSelectedIdx] = useState('');
  const [days,        setDays]        = useState(1);
  const [fuelByUs,    setFuelByUs]    = useState(true);
  const { fleet, settings } = useAdmin();
  const whatsapp = settings?.whatsapp || '923182277086';

  const car    = selectedIdx !== '' ? fleet[selectedIdx] : null;
  const base   = car ? car.price * days : 0;
  const fuel   = (car && fuelByUs) ? car.fuelCost * days : 0;
  const total  = base + fuel;

  const handleBook = () => {
    if (!car) { alert('Please select a car first!'); return; }
    const msg = `Hi! I'd like to book *${car.name}* for *${days} day(s)*. Estimated total: *${pkr(total)}*. Please confirm availability.`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };


  return (
    <section id="pricing" className="section bg-light">
      <div className="container">
        <div className="section-header text-center">
          <h2>Pricing Calculator</h2>
          <p>Estimate your rental cost instantly</p>
        </div>

        <div className="calculator-card">
          <div className="calc-header">
            <Calculator size={22} />
            <h3>Calculate Your Rental Cost</h3>
          </div>
          <div className="calc-body">
            <div className="calc-grid">

              {/* Form side */}
              <div className="calc-form-side">
                <div className="form-group">
                  <label htmlFor="carSelect">Select Car Model</label>
                  <select id="carSelect" value={selectedIdx} onChange={e => setSelectedIdx(e.target.value)}>
                    <option value="" disabled>Choose a car...</option>
                    {fleet.map((c, i) => (
                      <option key={c.id || i} value={i}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rentalDays">Rental Days</label>
                  <input
                    type="number" id="rentalDays" min={1} max={30}
                    value={days} onChange={e => setDays(Math.max(1, parseInt(e.target.value)||1))}
                  />
                </div>

                <div className="form-checkbox">
                  <input type="checkbox" id="fuelOption" checked={!fuelByUs} onChange={e => setFuelByUs(!e.target.checked)} />
                  <label htmlFor="fuelOption">Fuel by customer (saves money)</label>
                </div>

                <div className="calc-inclusions">
                  <div className="inclusion-item">
                    <span>Driver Service</span>
                    <span className="status-badge"><Check size={14} /> Always Included</span>
                  </div>
                  <div className="inclusion-item">
                    <span>Insurance Coverage</span>
                    <span className="status-badge"><Check size={14} /> Included</span>
                  </div>
                </div>

                {car && (
                  <div className="selected-vehicle-card" style={{ display: 'block' }}>
                    <h4>Selected Vehicle</h4>
                    <div className="selected-vehicle-box">
                      <img src={car.img || 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/Corolla%20.jpg'} alt={car.name} />
                      <div className="selected-vehicle-name">{car.name}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary side */}
              <div className="calc-summary-side">
                <div className="price-breakdown-card">
                  <h3>Price Breakdown</h3>
                  <div className="breakdown-list">
                    <div className="breakdown-item">
                      <span className="label">Base Rate ({days} days)</span>
                      <span className="value">{pkr(base)}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="label">Driver Service</span>
                      <span className="value text-success">Included</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="label">Fuel Cost</span>
                      <span className="value">{pkr(fuel)}</span>
                    </div>
                  </div>
                  <div className="total-estimate">
                    <span className="label">Total Estimate</span>
                    <span className="value">{pkr(total)}</span>
                  </div>
                  <button className="btn btn-primary btn-block" onClick={handleBook}>
                    <MessageCircle size={16} /> Get Quote via WhatsApp
                  </button>
                </div>

                <div className="pro-tips">
                  <h4><Lightbulb size={16} /> Pro Tips</h4>
                  <ul>
                    <li>Longer rentals may qualify for discounts</li>
                    <li>Fuel by customer option saves upto 50%</li>
                    <li>All vehicles include comprehensive insurance</li>
                    <li>Professional drivers know the best routes</li>
                  </ul>
                </div>

                <div className="custom-quote-msg">
                  For custom quotes or long-term rentals, contact us on WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
