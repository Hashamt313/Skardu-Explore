import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '',
  img: '', author: 'Skardu Explore Team', category: 'Travel Guide',
  date: new Date().toISOString().split('T')[0], status: 'published'
};

const CATEGORIES = ['Travel Guide', 'Tips & Advice', 'Adventure', 'Culture', 'Food & Stay', 'Photography'];

export default function BlogsManager() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useAdmin();
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (b) => {
    setForm({
      title: b.title, slug: b.slug || '', excerpt: b.excerpt || '',
      content: b.content || '', img: b.img || '', author: b.author || 'Skardu Explore Team',
      category: b.category || 'Travel Guide',
      date: b.date ? b.date.split('T')[0] : new Date().toISOString().split('T')[0],
      status: b.status || 'published',
    });
    setEditId(b.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const data = { ...form, slug };
    if (editId) await updateBlog(editId, data);
    else        await addBlog(data);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this blog post?')) await deleteBlog(id);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, img: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">Blogs Management</h2>
        <button className="admin-btn-primary" onClick={openAdd}><Plus size={16}/> Add Blog</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(b => (
              <tr key={b.id}>
                <td>{b.img ? <img src={b.img} alt={b.title} style={{width:60,height:40,objectFit:'cover',borderRadius:6}}/> : '—'}</td>
                <td><strong>{b.title}</strong><br/><small style={{color:'#94a3b8'}}>{b.excerpt?.slice(0,60)}{b.excerpt?.length > 60 ? '…' : ''}</small></td>
                <td>{b.category}</td>
                <td>{b.author}</td>
                <td>{b.date ? new Date(b.date).toLocaleDateString('en-US', {year:'numeric',month:'short',day:'numeric'}) : '—'}</td>
                <td><span className={`admin-status-badge ${b.status}`}>{b.status === 'published' ? 'Published' : 'Draft'}</span></td>
                <td>
                  <div className="admin-action-btns">
                    <button className="admin-btn-edit" onClick={() => openEdit(b)}><Pencil size={14}/></button>
                    <button className="admin-btn-del"  onClick={() => handleDelete(b.id)}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && <tr><td colSpan={7} className="admin-td-empty">No blog posts found</td></tr>}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '700px' }}>
            <div className="admin-modal-header">
              <h3>{editId ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-group">
                <label>Blog Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Top 10 Places to Visit in Skardu" required/>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Author</label>
                  <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="Skardu Explore Team"/>
                </div>
                <div className="admin-form-group">
                  <label>Publish Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Short Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="A brief summary of the blog post (shown in cards)..."/>
              </div>
              <div className="admin-form-group">
                <label>Full Content</label>
                <textarea rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Full blog post content..."/>
              </div>
              <div className="admin-form-group">
                <label>Cover Image URL or Upload</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    value={form.img.startsWith('data:') ? 'File Uploaded' : form.img}
                    onChange={e => setForm({...form, img: e.target.value})}
                    placeholder="https://..."
                    style={{ flexGrow: 1 }}
                  />
                  <label className="admin-btn-outline" style={{ margin: 0, padding: '10px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    Choose File
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }}/>
                  </label>
                </div>
                {form.img && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={form.img} alt="Preview" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}/>
                    <button type="button" className="admin-btn-del" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => setForm({ ...form, img: '' })}>
                      <Trash2 size={12}/>
                    </button>
                  </div>
                )}
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
