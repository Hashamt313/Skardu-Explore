import { useState } from 'react';
import { Calendar, User, Tag, ArrowRight, X, BookOpen } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

function BlogModal({ blog, onClose, whatsapp }) {
  if (!blog) return null;
  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal" onClick={e => e.stopPropagation()}>
        <button className="blog-modal-close" onClick={onClose}><X size={22}/></button>
        {blog.img && (
          <div className="blog-modal-img-wrap">
            <img src={blog.img} alt={blog.title}/>
          </div>
        )}
        <div className="blog-modal-body">
          <span className="blog-tag">{blog.category}</span>
          <h2>{blog.title}</h2>
          <div className="blog-meta">
            <span><User size={14}/> {blog.author}</span>
            <span><Calendar size={14}/> {blog.date ? new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
          </div>
          <div className="blog-modal-content">
            {blog.content || blog.excerpt}
          </div>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I read your blog "${blog.title}" and want to know more about visiting Skardu.`)}`}
            target="_blank" rel="noreferrer"
            className="btn btn-primary"
            style={{ marginTop: '24px', display: 'inline-flex' }}
          >
            Plan My Trip Now
          </a>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog, onRead }) {
  return (
    <article className="blog-card">
      <div className="blog-card-img">
        <img
          src={blog.img || 'https://mediumvioletred-hedgehog-139961.hostingersite.com/img/skardu.webp'}
          alt={blog.title}
        />
        <span className="blog-tag blog-tag-overlay">{blog.category}</span>
      </div>
      <div className="blog-card-body">
        <div className="blog-meta">
          <span><Calendar size={13}/> {blog.date ? new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
          <span><User size={13}/> {blog.author}</span>
        </div>
        <h3>{blog.title}</h3>
        <p className="blog-excerpt">{blog.excerpt}</p>
        <button className="blog-read-more" onClick={() => onRead(blog)}>
          Read More <ArrowRight size={15}/>
        </button>
      </div>
    </article>
  );
}

export default function Blogs() {
  const { blogs, settings } = useAdmin();
  const whatsapp = settings?.whatsapp || '923182277086';
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const publishedBlogs = blogs.filter(b => b.status === 'published');
  const categories = ['All', ...new Set(publishedBlogs.map(b => b.category).filter(Boolean))];
  const filtered = activeCategory === 'All'
    ? publishedBlogs
    : publishedBlogs.filter(b => b.category === activeCategory);

  return (
    <>
      <section id="blogs" className="section bg-light">
        <div className="container">
          <div className="section-header text-center">
            <div className="blog-section-icon">
              <BookOpen size={28}/>
            </div>
            <h2>Travel Blog & Stories</h2>
            <p>Insider guides, travel tips, and adventure stories from the heart of Gilgit-Baltistan</p>
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="blog-filter-row">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`blog-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Blog Cards Grid */}
          <div className="blog-grid">
            {filtered.map(blog => (
              <BlogCard key={blog.id} blog={blog} onRead={setSelectedBlog}/>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.3 }}/>
                <p>No blog posts available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      {selectedBlog && (
        <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} whatsapp={whatsapp}/>
      )}
    </>
  );
}
