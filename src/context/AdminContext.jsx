import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AdminContext = createContext(null);
const API = '/api';

async function get(path) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`GET ${path} failed: ${r.status}`);
  return r.json();
}
async function post(path, data) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`POST ${path} failed: ${r.status}`);
  return r.json();
}
async function put(path, data) {
  const r = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`PUT ${path} failed: ${r.status}`);
  return r.json();
}
async function patch(path, data) {
  const r = await fetch(`${API}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error(`PATCH ${path} failed: ${r.status}`);
  return r.json();
}
async function del(path) {
  const r = await fetch(`${API}${path}`, { method: 'DELETE' });
  if (!r.ok) throw new Error(`DELETE ${path} failed: ${r.status}`);
  return r.json();
}

export function AdminProvider({ children }) {
  const [fleet,        setFleet]        = useState([]);
  const [tours,        setTours]        = useState([]);
  const [inquiries,    setInquiries]    = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [settings,     setSettings]     = useState({});
  const [blogs,        setBlogs]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // Load all data on mount
  useEffect(() => {
    Promise.all([
      get('/fleet'),
      get('/tours'),
      get('/inquiries'),
      get('/destinations'),
      get('/settings'),
      get('/blogs'),
    ])
      .then(([f, t, i, d, s, b]) => {
        setFleet(f);
        setTours(t);
        setInquiries(i);
        setDestinations(d);
        setSettings(s);
        setBlogs(b);
        setLoading(false);
      })
      .catch(err => {
        console.error('Backend connection failed:', err);
        setError('Backend server connection failed. Please run npm run dev:server.');
        setLoading(false);
      });
  }, []);

  // ── Fleet CRUD ─────────────────────────────────────────
  const addFleetItem = useCallback(async (data) => {
    const item = await post('/fleet', data);
    setFleet(prev => [...prev, item]);
    return item;
  }, []);

  const updateFleetItem = useCallback(async (id, data) => {
    const item = await put(`/fleet/${id}`, data);
    setFleet(prev => prev.map(f => f.id === id ? item : f));
    return item;
  }, []);

  const deleteFleetItem = useCallback(async (id) => {
    await del(`/fleet/${id}`);
    setFleet(prev => prev.filter(f => f.id !== id));
  }, []);

  // ── Tours CRUD ─────────────────────────────────────────
  const addTour = useCallback(async (data) => {
    const item = await post('/tours', data);
    setTours(prev => [...prev, item]);
    return item;
  }, []);

  const updateTour = useCallback(async (id, data) => {
    const item = await put(`/tours/${id}`, data);
    setTours(prev => prev.map(t => t.id === id ? item : t));
    return item;
  }, []);

  const deleteTour = useCallback(async (id) => {
    await del(`/tours/${id}`);
    setTours(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Inquiries ──────────────────────────────────────────
  const markInquiry = useCallback(async (id, status) => {
    const item = await patch(`/inquiries/${id}`, { status });
    setInquiries(prev => prev.map(i => i.id === id ? item : i));
    return item;
  }, []);

  const deleteInquiry = useCallback(async (id) => {
    await del(`/inquiries/${id}`);
    setInquiries(prev => prev.filter(i => i.id !== id));
  }, []);

  // ── Destinations CRUD ──────────────────────────────────
  const addDestination = useCallback(async (data) => {
    const item = await post('/destinations', data);
    setDestinations(prev => [...prev, item]);
    return item;
  }, []);

  const updateDestination = useCallback(async (id, data) => {
    const item = await put(`/destinations/${id}`, data);
    setDestinations(prev => prev.map(d => d.id === id ? item : d));
    return item;
  }, []);

  const deleteDestination = useCallback(async (id) => {
    await del(`/destinations/${id}`);
    setDestinations(prev => prev.filter(d => d.id !== id));
  }, []);

  // ── Blogs CRUD ────────────────────────────────────
  const addBlog = useCallback(async (data) => {
    const item = await post('/blogs', data);
    setBlogs(prev => [...prev, item]);
    return item;
  }, []);

  const updateBlog = useCallback(async (id, data) => {
    const item = await put(`/blogs/${id}`, data);
    setBlogs(prev => prev.map(b => b.id === id ? item : b));
    return item;
  }, []);

  const deleteBlog = useCallback(async (id) => {
    await del(`/blogs/${id}`);
    setBlogs(prev => prev.filter(b => b.id !== id));
  }, []);

  // ── Settings ───────────────────────────────────────────
  const updateSettings = useCallback(async (data) => {
    const updated = await put('/settings', data);
    setSettings(updated);
    return updated;
  }, []);

  // ── Helpers ─────────────────────────────────────────────
  const pkr = (n) => 'PKR ' + Number(n).toLocaleString('en-PK');

  return (
    <AdminContext.Provider value={{
      fleet, tours, inquiries, destinations, settings, blogs,
      loading, error,
      addFleetItem, updateFleetItem, deleteFleetItem,
      addTour, updateTour, deleteTour,
      markInquiry, deleteInquiry,
      addDestination, updateDestination, deleteDestination,
      addBlog, updateBlog, deleteBlog,
      updateSettings,
      pkr,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
};
