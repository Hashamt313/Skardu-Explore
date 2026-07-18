import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const EMPTY = { title: '', duration: '', price: '', persons: 2, status: 'active', img: '', highlights: '' };

export default function ToursManager() {
  const { tours, addTour, updateTour, deleteTour, pkr } = useAdmin();
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (t) => {
    setForm({ title: t.title, duration: t.duration, price: t.price,
              persons: t.persons, status: t.status, img: t.img,
              highlights: Array.isArray(t.highlights) ? t.highlights.join(', ') : t.highlights });
    setEditId(t.id); setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const highlights = form.highlights.split(',').map(h => h.trim()).filter(Boolean);
    const data = { ...form, price: +form.price, persons: +form.persons, highlights };
    if (editId) await updateTour(editId, data);
    else        await addTour(data);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tour package?')) await deleteTour(id);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Tours Management</h2>
        <button className="admin-btn-primary" onClick={openAdd}><Plus size={16}/> Add Tour</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(t => (
              <tr key={t.id}>
                <td>{t.img ? <img src={t.img} alt={t.title} style={{width:60,height:40,objectFit:'cover',borderRadius:6}}/> : '—'}</td>
                <td><strong>{t.title}</strong></td>
                <td>{t.duration}</td>
                <td>{pkr(t.price)}</td>
                <td><span className={`admin-status-badge ${t.status}`}>{t.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div className="admin-action-btns">
                    <button className="admin-btn-edit" onClick={() => openEdit(t)}><Pencil size={14}/></button>
                    <button className="admin-btn-del"  onClick={() => handleDelete(t.id)}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {tours.length === 0 && <tr><td colSpan={6} className="admin-td-empty">No tours found</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editId ? 'Edit Tour' : 'Add New Tour Package'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-group">
                <label>Tour Title</label>
                <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Skardu, Shigar & Hunza" required/>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Duration</label>
                  <input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="5 Days / 4 Nights"/>
                </div>
                <div className="admin-form-group">
                  <label>Price (PKR)</label>
                  <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="75000"/>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Persons (Minimum)</label>
                  <input type="number" value={form.persons} onChange={e=>setForm({...form,persons:e.target.value})} placeholder="2"/>
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Image URL or Upload File</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    value={form.img.startsWith('data:') ? 'File Uploaded' : form.img} 
                    onChange={e=>setForm({...form,img:e.target.value})} 
                    placeholder="https://..." 
                    style={{ flexGrow: 1 }}
                  />
                  <label className="admin-btn-outline" style={{ margin: 0, padding: '10px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    Choose File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>
                {form.img && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={form.img} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                    <button type="button" className="admin-btn-del" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => setForm({ ...form, img: '' })}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <div className="admin-form-group">
                <label>Highlights (comma separated)</label>
                <textarea rows={3} value={form.highlights} onChange={e=>setForm({...form,highlights:e.target.value})} placeholder="Shangrila Resort, Deosai National Park, K2 View"/>
              </div>
              <div className="admin-form-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary"><Check size={16}/> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
