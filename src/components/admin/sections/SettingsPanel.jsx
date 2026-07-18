import { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export default function SettingsPanel() {
  const { settings, updateSettings } = useAdmin();
  const [form, setForm]     = useState({ ...settings });
  const [saved, setSaved]   = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Website Settings</h2>
      </div>

      <div className="admin-settings-card">
        <form onSubmit={handleSave} className="admin-form">
          <h3 className="admin-form-section-title">Contact Information</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>WhatsApp Number</label>
              <input value={form.whatsapp || ''} onChange={e=>setForm({...form,whatsapp:e.target.value})} placeholder="923182277086"/>
            </div>
            <div className="admin-form-group">
              <label>Phone Number</label>
              <input value={form.phone || ''} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+92 318 227 7086"/>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Email</label>
              <input type="email" value={form.email || ''} onChange={e=>setForm({...form,email:e.target.value})} placeholder="alpineresort92@gmail.com"/>
            </div>
            <div className="admin-form-group">
              <label>Address</label>
              <input value={form.address || ''} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Main Bazaar, Skardu"/>
            </div>
          </div>

          <h3 className="admin-form-section-title" style={{marginTop:'1.5rem'}}>Social Media</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Facebook Link</label>
              <input value={form.facebook || ''} onChange={e=>setForm({...form,facebook:e.target.value})} placeholder="https://facebook.com/..."/>
            </div>
            <div className="admin-form-group">
              <label>Instagram Link</label>
              <input value={form.instagram || ''} onChange={e=>setForm({...form,instagram:e.target.value})} placeholder="https://instagram.com/..."/>
            </div>
          </div>

          <div className="admin-form-footer">
            <button type="submit" className={`admin-btn-primary ${saved ? 'saved' : ''}`}>
              {saved ? <><Check size={16}/> Saved!</> : <><Save size={16}/> Save Settings</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
