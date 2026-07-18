import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const EMPTY = { name: '', year: '', passengers: '', fuel: 'Petrol', price: '', fuelCost: '', status: 'available', img: '' };

export default function FleetManager() {
  const { fleet, addFleetItem, updateFleetItem, deleteFleetItem, pkr } = useAdmin();
  const [form, setForm]   = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ name: item.name, year: item.year, passengers: item.passengers,
              fuel: item.fuel, price: item.price, fuelCost: item.fuelCost,
              status: item.status, img: item.img });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...form, passengers: +form.passengers, price: +form.price, fuelCost: +form.fuelCost };
    if (editId) await updateFleetItem(editId, data);
    else        await addFleetItem(data);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this vehicle?')) await deleteFleetItem(id);
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
        <h2 className="admin-section-title">Fleet Management</h2>
        <button className="admin-btn-primary" onClick={openAdd}><Plus size={16}/> Add Vehicle</button>
      </div>

      <div className="admin-grid-3">
        {fleet.map(car => (
          <div key={car.id} className="admin-car-card">
            <img 
              src={car.img || 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/Corolla%20.jpg'} 
              alt={car.name} 
              className="admin-car-img" 
              onError={(e) => { e.target.src = 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/Corolla%20.jpg'; }}
            />
            <div className="admin-car-body">
              <h3>{car.name}</h3>
              <p className="admin-car-year">{car.year}</p>
              <div className="admin-car-meta">
                <span>👥 {car.passengers}</span>
                <span>⛽ {car.fuel}</span>
                <span className={`admin-status-badge ${car.status}`}>
                  {car.status === 'available' ? 'Available' : 'Booked'}
                </span>
              </div>
              <p className="admin-car-price">{pkr(car.price)} <small>/day</small></p>
              <div className="admin-card-actions">
                <button className="admin-btn-edit" onClick={() => openEdit(car)}><Pencil size={14}/> Edit</button>
                <button className="admin-btn-del"  onClick={() => handleDelete(car.id)}><Trash2 size={14}/> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Vehicle Name</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Toyota Prado" required/>
                </div>
                <div className="admin-form-group">
                  <label>Year / Type</label>
                  <input value={form.year} onChange={e=>setForm({...form,year:e.target.value})} placeholder="2013-2020"/>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Passengers</label>
                  <input type="number" value={form.passengers} onChange={e=>setForm({...form,passengers:e.target.value})} placeholder="6"/>
                </div>
                <div className="admin-form-group">
                  <label>Fuel</label>
                  <select value={form.fuel} onChange={e=>setForm({...form,fuel:e.target.value})}>
                    <option>Petrol</option><option>Diesel</option><option>CNG</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price per Day (PKR)</label>
                  <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="18000"/>
                </div>
                <div className="admin-form-group">
                  <label>Fuel Cost (PKR)</label>
                  <input type="number" value={form.fuelCost} onChange={e=>setForm({...form,fuelCost:e.target.value})} placeholder="10000"/>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
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
