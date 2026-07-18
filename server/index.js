import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('\n⚠️  WARNING: DATABASE_URL is not set in your .env file.');
  console.warn('👉 Please add a valid DATABASE_URL to your .env file.\n');
}

// Automatically create tables and seed data if settings table does not exist
async function initializeDatabase() {
  try {
    // Check if settings table exists
    await pool.query('SELECT 1 FROM settings LIMIT 1');
    console.log('✅ Database schema verified (settings table exists).');
  } catch (err) {
    console.log('⚠️  Database schema not found. Initializing tables and seed data...');
    try {
      const sqlPath = path.join(__dirname, 'supabase_setup.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf8');
        // Execute the entire SQL setup file
        await pool.query(sql);
        console.log('✅ Successfully initialized database schema and seeded all data from JSON files!');
      } else {
        console.error('❌ database setup SQL file not found at:', sqlPath);
        console.error('👉 Running the seed generator to create it...');
      }
    } catch (seedingError) {
      console.error('❌ Failed to run database auto-initialization script:', seedingError.message);
    }
  }

  // Check if blogs table exists, if not create and seed it
  try {
    await pool.query('SELECT 1 FROM blogs LIMIT 1');
  } catch (blogErr) {
    console.log('⚠️  Blogs table not found. Creating and seeding blogs table...');
    try {
      const createBlogsTableSql = `
        CREATE TABLE IF NOT EXISTS blogs (
          id BIGINT PRIMARY KEY,
          title TEXT,
          slug TEXT,
          excerpt TEXT,
          content TEXT,
          img TEXT,
          author TEXT,
          category TEXT,
          date TEXT,
          status TEXT
        );
        ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
      `;
      await pool.query(createBlogsTableSql);
      
      const blogsJsonPath = path.join(__dirname, 'data', 'blogs.json');
      if (fs.existsSync(blogsJsonPath)) {
        const blogs = JSON.parse(fs.readFileSync(blogsJsonPath, 'utf8'));
        for (const blog of blogs) {
          await pool.query(
            `INSERT INTO blogs (id, title, slug, excerpt, content, img, author, category, date, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO NOTHING`,
            [
              blog.id,
              blog.title,
              blog.slug,
              blog.excerpt,
              blog.content,
              blog.img,
              blog.author,
              blog.category,
              blog.date,
              blog.status
            ]
          );
        }
        console.log(`✅ Successfully seeded ${blogs.length} blogs into the database.`);
      }
    } catch (seedingBlogError) {
      console.error('❌ Failed to auto-initialize blogs table:', seedingBlogError.message);
    }
  }
}

let pool;
try {
  // Initialize PostgreSQL Connection Pool
  // Using explicit params instead of connection string to avoid pg URL parsing
  // issues with Supabase pooler's "postgres.PROJECT_ID" username format
  const dbConfig = connectionString
    ? (() => {
        try {
          const url = new URL(connectionString);
          return {
            host: url.hostname,
            port: parseInt(url.port) || 5432,
            user: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            database: url.pathname.replace('/', ''),
            ssl: { rejectUnauthorized: false }
          };
        } catch {
          return { connectionString, ssl: { rejectUnauthorized: false } };
        }
      })()
    : null;

  pool = dbConfig ? new Pool(dbConfig) : null;

  // Handle unexpected database client errors to prevent process crashing
  pool.on('error', (err) => {
    console.error('⚠️  Unexpected error on idle database client:', err.message);
  });

  // Test connection and auto-initialize database on startup
  pool.connect(async (err, client, release) => {
    if (err) {
      console.error('\n❌ Failed to connect to Supabase database:', err.message);
      console.error('👉 Ensure you have set up your database password correctly in the .env file.\n');
    } else {
      console.log('\n✅ Successfully connected to Supabase PostgreSQL database!');
      release();
      try {
        await initializeDatabase();
      } catch (dbInitErr) {
        console.error('❌ Database auto-initialization failed:', dbInitErr.message);
      }
    }
  });
} catch (e) {
  console.error('\n❌ Failed to initialize database connection pool:', e.message);
  console.error('👉 The DATABASE_URL in your .env file is likely malformed or invalid.\n');
}

// Helper wrapper to catch errors in async route handlers
const handleRoute = (fn) => async (req, res, next) => {
  try {
    if (!pool) {
      throw new Error('Database connection pool is not initialized. Please configure your .env file correctly.');
    }
    await fn(req, res, next);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({
      error: 'Database operation failed',
      details: error.message
    });
  }
};

// ── Generic CRUD Router Factory for Database Tables ────────────
function makeDBRouter(tableName) {
  const router = express.Router();

  // GET all records
  router.get('/', handleRoute(async (req, res) => {
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
    res.json(result.rows);
  }));

  // GET single record by ID
  router.get('/:id', handleRoute(async (req, res) => {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result.rows[0]);
  }));

  // POST (Create new record)
  router.post('/', handleRoute(async (req, res) => {
    // Generate a default ID (bigint timestamp) if not provided
    const id = req.body.id || Date.now();
    const keys = ['id', ...Object.keys(req.body).filter(k => k !== 'id')];
    const values = [id, ...keys.slice(1).map(k => req.body[k])];

    const columnsStr = keys.map(k => `"${k}"`).join(', ');
    const placeholdersStr = keys.map((_, i) => `$${i + 1}`).join(', ');

    const query = `INSERT INTO ${tableName} (${columnsStr}) VALUES (${placeholdersStr}) RETURNING *`;
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  }));

  // PUT (Update full record)
  router.put('/:id', handleRoute(async (req, res) => {
    const keys = Object.keys(req.body).filter(k => k !== 'id');
    if (keys.length === 0) {
      const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
      return res.json(result.rows[0]);
    }

    const values = keys.map(k => req.body[k]);
    values.push(req.params.id);

    const setStr = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const query = `UPDATE ${tableName} SET ${setStr} WHERE id = $${keys.length + 1} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result.rows[0]);
  }));

  // PATCH (Partial update)
  router.patch('/:id', handleRoute(async (req, res) => {
    const keys = Object.keys(req.body).filter(k => k !== 'id');
    if (keys.length === 0) {
      const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
      return res.json(result.rows[0]);
    }

    const values = keys.map(k => req.body[k]);
    values.push(req.params.id);

    const setStr = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const query = `UPDATE ${tableName} SET ${setStr} WHERE id = $${keys.length + 1} RETURNING *`;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result.rows[0]);
  }));

  // DELETE record
  router.delete('/:id', handleRoute(async (req, res) => {
    const result = await pool.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ success: true });
  }));

  return router;
}

// ── Define Resource Routes ────────────────────────────────────
app.use('/api/fleet',        makeDBRouter('fleet'));
app.use('/api/tours',        makeDBRouter('tours'));
app.use('/api/inquiries',    makeDBRouter('inquiries'));
app.use('/api/destinations', makeDBRouter('destinations'));
app.use('/api/blogs',        makeDBRouter('blogs'));

// ── Settings Routes (Single record with id=1) ─────────────────
app.get('/api/settings', handleRoute(async (req, res) => {
  const result = await pool.query('SELECT * FROM settings WHERE id = 1');
  if (result.rows.length === 0) {
    return res.json({});
  }
  res.json(result.rows[0]);
}));

app.put('/api/settings', handleRoute(async (req, res) => {
  const keys = Object.keys(req.body).filter(k => k !== 'id');
  if (keys.length === 0) {
    const result = await pool.query('SELECT * FROM settings WHERE id = 1');
    return res.json(result.rows[0]);
  }

  const values = keys.map(k => req.body[k]);
  const setStr = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');

  const query = `UPDATE settings SET ${setStr} WHERE id = 1 RETURNING *`;
  const result = await pool.query(query, values);
  res.json(result.rows[0]);
}));

// Health check endpoint
app.get('/api/health', handleRoute(async (req, res) => {
  const dbHealth = await pool.query('SELECT NOW()');
  res.json({ 
    status: 'ok', 
    serverTime: new Date(), 
    dbTime: dbHealth.rows[0].now 
  });
}));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Skardu Explore Backend running at http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/fleet`);
  console.log(`   API: http://localhost:${PORT}/api/tours`);
  console.log(`   API: http://localhost:${PORT}/api/inquiries`);
});
