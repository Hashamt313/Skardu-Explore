import { useState } from 'react';
import { Trash2, MessageSquare, Phone, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const STATUS_CONFIG = {
  new:       { label: 'New',       color: '#f59e0b', icon: Clock },
  contacted: { label: 'Contacted', color: '#0ea5e9', icon: MessageSquare },
  resolved:  { label: 'Resolved',  color: '#10b981', icon: CheckCircle },
  rejected:  { label: 'Rejected',  color: '#ef4444', icon: XCircle },
};

export default function InquiriesManager() {
  const { inquiries, markInquiry, deleteInquiry } = useAdmin();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  const handleStatus = async (id, status) => {
    await markInquiry(id, status);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this inquiry?')) await deleteInquiry(id);
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Customer Inquiries</h2>
        <div className="admin-filter-tabs">
          {['all', 'new', 'contacted', 'resolved'].map(f => (
            <button
              key={f}
              className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label}
              {f === 'new' && inquiries.filter(i=>i.status==='new').length > 0 && (
                <span className="admin-badge">{inquiries.filter(i=>i.status==='new').length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-inquiries-list">
        {filtered.map(inq => {
          const cfg = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;
          const Icon = cfg.icon;
          return (
            <div key={inq.id} className="admin-inquiry-card">
              <div className="admin-inq-header">
                <div className="admin-inq-avatar">
                  {inq.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="admin-inq-info">
                  <h4>{inq.name}</h4>
                  <p>{inq.date ? new Date(inq.date).toLocaleString('ur-PK') : '—'}</p>
                </div>
                <span className="admin-status-badge" style={{background: cfg.color+'20', color: cfg.color}}>
                  <Icon size={12}/> {cfg.label}
                </span>
              </div>

              <p className="admin-inq-msg">{inq.message}</p>

              <div className="admin-inq-footer">
                <div className="admin-inq-contact">
                  {inq.phone && (
                    <a href={`tel:${inq.phone}`} className="admin-inq-phone">
                      <Phone size={14}/> {inq.phone}
                    </a>
                  )}
                  {inq.whatsapp !== false && inq.phone && (
                    <a href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g,'')}`}
                       target="_blank" rel="noreferrer" className="admin-inq-wa">
                      💬 WhatsApp
                    </a>
                  )}
                </div>
                <div className="admin-inq-actions">
                  <select
                    value={inq.status}
                    onChange={e => handleStatus(inq.id, e.target.value)}
                    className="admin-status-select"
                  >
                    {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                      <option key={v} value={v}>{c.label}</option>
                    ))}
                  </select>
                  <button className="admin-btn-del" onClick={() => handleDelete(inq.id)}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="admin-empty-state">
            <MessageSquare size={48} opacity={0.3}/>
            <p>No inquiries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
