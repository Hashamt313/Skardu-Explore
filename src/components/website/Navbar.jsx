import { useState, useEffect } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import SkarduLogo from '../../assets/Skardu Logo.png';
import { useAdmin } from '../../context/AdminContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('home');
  const { settings } = useAdmin();

  const siteName = settings?.siteName || 'Skardu Explore';
  const phone = settings?.phone || '+92 318 227 7086';
  const whatsapp = settings?.whatsapp || '923182277086';
  const cleanPhone = phone.replace(/\s+/g, '');

  const nameParts = siteName.split(' ');
  const logoFirst = nameParts[0] || 'Skardu';
  const logoRest = nameParts.slice(1).join(' ') || 'Explore';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'pricing', 'fleet', 'tours', 'blogs', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) setActive(id);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#fleet', label: 'Fleet' },
    { href: '#tours', label: 'Tours' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#blogs', label: 'Blogs' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActive(id.replace('#', ''));
    setMobileOpen(false);
  };

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <div className="container nav-container">
        <div className="logo">
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={SkarduLogo}
              alt="Skardu Explore Logo"
              style={{ height: '54px', width: 'auto', objectFit: 'contain' }}
            />
            <span style={{ fontWeight: 800, fontSize: '1.55rem', letterSpacing: '0.5px', color: '#fff' }}>
              {logoFirst} <span style={{ color: '#fff', fontWeight: 800 }}>{logoRest}</span>
            </span>
          </a>
        </div>

        <div className="nav-links">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href.replace('#', '') ? 'active' : ''}
              onClick={() => handleNavClick(l.href)}
            >{l.label}</a>
          ))}
        </div>

        <div className="nav-actions">
          <a href={`tel:${cleanPhone}`} className="btn btn-outline hide-mobile">Call Now</a>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-primary">
            <MessageCircle size={16} /><span>WhatsApp</span>
          </a>
          <button className="menu-toggle" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu open">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => handleNavClick(l.href)}>{l.label}</a>
          ))}
          <a href={`tel:${cleanPhone}`} className="mobile-cta">Call Now</a>
        </div>
      )}
    </nav>
  );
}
