import { useState } from 'react';
import {
  LayoutDashboard, Car, MapPin, MessageSquare, Settings,
  LogOut, Menu, X, TrendingUp, Users, Eye, AlertCircle, BookOpen
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import FleetManager from './sections/FleetManager';
import ToursManager from './sections/ToursManager';
import InquiriesManager from './sections/InquiriesManager';
import SettingsPanel from './sections/SettingsPanel';
import BlogsManager from './sections/BlogsManager';

const navItems = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'fleet',     label: 'Fleet',      icon: Car },
  { id: 'tours',     label: 'Tours',      icon: MapPin },
  { id: 'blogs',     label: 'Blogs',      icon: BookOpen },
  { id: 'inquiries', label: 'Inquiries',  icon: MessageSquare },
  { id: 'settings',  label: 'Settings',   icon: Settings },
];

export default function AdminDashboard({ onLogout }) {
  const [active, setActive]   = useState('dashboard');
  const [sideOpen, setSide]   = useState(false);
  const { fleet, tours, inquiries, loading, error, pkr } = useAdmin();

  const newInquiries = inquiries.filter(i => i.status === 'new').length;

  const stats = [
    { label: 'Total Fleet',     value: fleet.length,      icon: Car,           color: '#ea580c' },
    { label: 'Active Tours',    value: tours.filter(t=>t.status==='active').length, icon: MapPin, color: '#0ea5e9' },
    { label: 'New Inquiries',   value: newInquiries,      icon: MessageSquare, color: '#10b981' },
    { label: 'Total Inquiries', value: inquiries.length,  icon: Users,         color: '#8b5cf6' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-logo">
          <h2>Skardu <span>Explore</span></h2>
          <button className="admin-sidebar-close" onClick={() => setSide(false)}><X size={18}/></button>
        </div>

        <nav className="admin-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`admin-nav-item ${active === id ? 'active' : ''}`}
              onClick={() => { setActive(id); setSide(false); }}
            >
              <Icon size={20} />
              <span>{label}</span>
              {id === 'inquiries' && newInquiries > 0 && (
                <span className="admin-badge">{newInquiries}</span>
              )}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={onLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Sidebar overlay */}
      {sideOpen && <div className="admin-overlay" onClick={() => setSide(false)} />}

      {/* Main area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setSide(true)}>
            <Menu size={22} />
          </button>
          <div className="admin-topbar-title">
            {navItems.find(n => n.id === active)?.label}
          </div>
          <div className="admin-topbar-right">
            <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
              <Eye size={16} /> View Website
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {loading && (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <p>Loading data...</p>
            </div>
          )}

          {error && (
            <div className="admin-error-banner">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!loading && active === 'dashboard' && (
            <div>
              <h2 className="admin-section-title">Overview</h2>
              <div className="admin-stats-grid">
                {stats.map((s, i) => (
                  <div key={i} className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: s.color + '20', color: s.color }}>
                      <s.icon size={24} />
                    </div>
                    <div className="admin-stat-info">
                      <p className="admin-stat-label">{s.label}</p>
                      <h3 className="admin-stat-value">{s.value}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Inquiries */}
              <h2 className="admin-section-title" style={{marginTop:'2rem'}}>Recent Inquiries</h2>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0,5).map(inq => (
                      <tr key={inq.id}>
                        <td>{inq.name}</td>
                        <td><a href={`tel:${inq.phone}`}>{inq.phone}</a></td>
                        <td className="admin-td-msg">{inq.message}</td>
                        <td>{inq.date ? new Date(inq.date).toLocaleDateString('en-US') : '—'}</td>
                        <td>
                          <span className={`admin-status-badge ${inq.status}`}>
                            {inq.status === 'new' ? 'New' : inq.status === 'contacted' ? 'Contacted' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr><td colSpan={5} className="admin-td-empty">No inquiries found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && active === 'fleet'     && <FleetManager />}
          {!loading && active === 'tours'     && <ToursManager />}
          {!loading && active === 'blogs'     && <BlogsManager />}
          {!loading && active === 'inquiries' && <InquiriesManager />}
          {!loading && active === 'settings'  && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}
