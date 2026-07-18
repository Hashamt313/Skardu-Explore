import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import Navbar from './components/website/Navbar';
import HeroSlider from './components/website/HeroSlider';
import PricingCalculator from './components/website/PricingCalculator';
import Fleet from './components/website/Fleet';
import Tours from './components/website/Tours';
import Blogs from './components/website/Blogs';

import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

import dest1 from './assets/gb image/image.png';
import dest2 from './assets/gb image/image copy.png';
import dest3 from './assets/gb image/image copy 2.png';
import dest4 from './assets/gb image/image copy 3.png';

const destinations = [
  { name: 'Deosai National Park', desc: 'Land of Giants', img: dest1 },
  { name: 'Katpana Cold Desert', desc: 'Unique sand dunes', img: dest2 },
  { name: 'Manthoka Waterfall', desc: 'Natural beauty', img: dest3 },
  { name: 'Shangrila Resort', desc: 'Lower Kachura Lake', img: dest4 },
];

function Website() {
  const { settings } = useAdmin();
  const activeDestinations = destinations;

  const phone = settings?.phone || '+92 318 227 7086';
  const whatsapp = settings?.whatsapp || '923182277086';
  const email = settings?.email || 'alpineresort92@gmail.com';
  const address = settings?.address || 'Main Bazaar, Skardu, Gilgit-Baltistan';
  const facebook = settings?.facebook || 'https://www.facebook.com/people/Alpine-Tours-Skardu/100077133245114/';
  const instagram = settings?.instagram || 'https://www.instagram.com/incredibleskardu';
  const siteName = settings?.siteName || 'Skardu Explore';
  const cleanPhone = phone.replace(/\s+/g, '');

  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSlider />

      {/* Pricing Calculator Section */}
      <PricingCalculator />

      {/* Fleet Section */}
      <Fleet />

      {/* Tour Services Section */}
      <Tours />

      {/* Blogs Section */}
      <Blogs />


      {/* Destinations Section */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Popular Destinations</h2>
          </div>
          <div className="grid grid-4">
            {activeDestinations.map((d, i) => (
              <div key={d.id || i} className="dest-card">
                <img src={d.img || 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/deosai-national-park.webp'} alt={d.name} />
                <div className="dest-overlay">
                  <h4>{d.name}</h4>
                  <p>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-dark text-white">
        <div className="container">
          <div className="section-header text-center">
            <h2>Get in Touch With Us</h2>
            <p>Ready to book your Skardu adventure?</p>
          </div>

          <div className="grid grid-3 contact-cards">
            <div className="contact-card">
              <div className="icon-circle bg-whatsapp"><MessageCircle size={22} /></div>
              <h3>WhatsApp</h3>
              <p>Chat with us instantly</p>
              <a href={`https://wa.me/${whatsapp}`} className="btn btn-whatsapp btn-block">Chat Now</a>
            </div>
            <div className="contact-card">
              <div className="icon-circle bg-phone"><Phone size={22} /></div>
              <h3>Phone Call</h3>
              <p>Speak with our team</p>
              <a href={`tel:${cleanPhone}`} className="btn btn-phone btn-block" id="phoneCallBtn">Call Now</a>
            </div>
            <div className="contact-card">
              <div className="icon-circle" style={{ background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </div>
              <h3>Messenger</h3>
              <p>Facebook Messenger</p>
              <a href={facebook} target="_blank" rel="noreferrer" className="btn btn-facebook btn-block">Visit Page</a>
            </div>
          </div>

          <div className="grid grid-2 mt-section">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <div className="info-item">
                <Phone className="text-primary" />
                <div>
                  <strong>Phone</strong>
                  <p>{phone}</p>
                </div>
              </div>
              <div className="info-item">
                <Mail className="text-primary" />
                <div>
                  <strong>Email</strong>
                  <p>{email}</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin className="text-primary" />
                <div>
                  <strong>Address</strong>
                  <p>{address}</p>
                </div>
              </div>
            </div>

            <div className="why-us">
              <h3>Why Choose Us?</h3>
              <ul className="check-list">
                <li><span>✓</span> Professional drivers with local knowledge</li>
                <li><span>✓</span> Well-maintained and insured vehicles</li>
                <li><span>✓</span> Customized tour plans</li>
                <li><span>✓</span> 24/7 customer support</li>
                <li><span>✓</span> Easy booking via WhatsApp</li>
              </ul>
            </div>
          </div>

          <div className="final-cta">
            <h3>Start Your Skardu Adventure</h3>
            <p>Book your car rental or tour package today</p>
            <a href={`https://wa.me/${whatsapp}`} className="btn btn-white btn-lg">Start Booking Now</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="grid grid-4">
            <div className="footer-col">
              <h3>{siteName}</h3>
              <p>Your trusted partner for car rentals and tour packages in Skardu.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#fleet">Fleet</a></li>
                <li><a href="#tours">Tours</a></li>
                <li><a href="#blogs">Blogs</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                <li><a href="#pricing">Car Rental</a></li>
                <li><a href="#tours">Tour Packages</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href={facebook} target="_blank" rel="noreferrer" className="facebook-link" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href={instagram} target="_blank" rel="noreferrer" className="instagram-link" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 {siteName}. All rights reserved. Made by haideri</p>
          </div>
        </div>
      </footer>
    </>
  );
}

function AdminContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('admin_auth') === '1'
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/admin" element={<AdminContainer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}

