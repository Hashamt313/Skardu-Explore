import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_FILE = path.join(__dirname, 'supabase_setup.sql');

function readJSON(file) {
  const p = path.join(DATA_DIR, file);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function escapeSQL(val) {
  if (val === null || val === undefined) return '';
  return String(val).replace(/'/g, "''");
}

function formatVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  return `'${escapeSQL(val)}'`;
}

function formatHighlights(h) {
  if (Array.isArray(h)) {
    return `ARRAY[${h.map(val => `'${escapeSQL(val)}'`).join(', ')}]::TEXT[]`;
  } else if (typeof h === 'string') {
    const arr = h.split(',').map(s => s.trim());
    return `ARRAY[${arr.map(val => `'${escapeSQL(val)}'`).join(', ')}]::TEXT[]`;
  }
  return 'ARRAY[]::TEXT[]';
}

let sql = `-- Supabase Schema & Seed Data Setup
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/fmlssftftaestdhwgosb/editor)

-- 1. Create tables if they do not exist
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  "siteName" TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  facebook TEXT,
  instagram TEXT,
  currency TEXT
);

CREATE TABLE IF NOT EXISTS destinations (
  id BIGINT PRIMARY KEY,
  name TEXT,
  "desc" TEXT,
  img TEXT
);

CREATE TABLE IF NOT EXISTS fleet (
  id BIGINT PRIMARY KEY,
  name TEXT,
  year TEXT,
  passengers INT,
  fuel TEXT,
  price NUMERIC,
  "fuelCost" NUMERIC,
  status TEXT,
  img TEXT
);

CREATE TABLE IF NOT EXISTS tours (
  id BIGINT PRIMARY KEY,
  title TEXT,
  duration TEXT,
  price NUMERIC,
  persons INT,
  status TEXT,
  img TEXT,
  highlights TEXT[]
);

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT PRIMARY KEY,
  name TEXT,
  phone TEXT,
  msg TEXT,
  tour TEXT,
  date TEXT,
  time TEXT,
  status TEXT
);

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

-- Enable RLS (Row Level Security) or make tables public for anonymous access
-- For this application, we will disable RLS to allow direct CRUD operations from Express backend
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE destinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE fleet DISABLE ROW LEVEL SECURITY;
ALTER TABLE tours DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- 2. Clear existing data to prevent duplicate primary key errors during seeding
TRUNCATE TABLE settings RESTART IDENTITY CASCADE;
TRUNCATE TABLE destinations CASCADE;
TRUNCATE TABLE fleet CASCADE;
TRUNCATE TABLE tours CASCADE;
TRUNCATE TABLE inquiries CASCADE;
TRUNCATE TABLE blogs CASCADE;

`;

// --- Seed settings ---
try {
  const settings = readJSON('settings.json');
  sql += `-- Seed settings\n`;
  sql += `INSERT INTO settings (id, "siteName", phone, whatsapp, email, address, facebook, instagram, currency)\nVALUES (\n  1,\n  ${formatVal(settings.siteName)},\n  ${formatVal(settings.phone)},\n  ${formatVal(settings.whatsapp)},\n  ${formatVal(settings.email)},\n  ${formatVal(settings.address)},\n  ${formatVal(settings.facebook)},\n  ${formatVal(settings.instagram)},\n  ${formatVal(settings.currency)}\n);\n\n`;
} catch (e) {
  console.error('Error seeding settings:', e);
}

// --- Seed destinations ---
try {
  const destinations = readJSON('destinations.json');
  if (destinations.length > 0) {
    sql += `-- Seed destinations\n`;
    sql += `INSERT INTO destinations (id, name, "desc", img) VALUES\n`;
    const rows = destinations.map(d => `  (${d.id}, ${formatVal(d.name)}, ${formatVal(d.desc)}, ${formatVal(d.img)})`);
    sql += rows.join(',\n') + ';\n\n';
  }
} catch (e) {
  console.error('Error seeding destinations:', e);
}

// --- Seed fleet ---
try {
  const fleet = readJSON('fleet.json');
  if (fleet.length > 0) {
    sql += `-- Seed fleet\n`;
    sql += `INSERT INTO fleet (id, name, year, passengers, fuel, price, "fuelCost", status, img) VALUES\n`;
    const rows = fleet.map(f => `  (${f.id}, ${formatVal(f.name)}, ${formatVal(f.year)}, ${f.passengers || 0}, ${formatVal(f.fuel)}, ${f.price || 0}, ${f.fuelCost || 0}, ${formatVal(f.status)}, ${formatVal(f.img)})`);
    sql += rows.join(',\n') + ';\n\n';
  }
} catch (e) {
  console.error('Error seeding fleet:', e);
}

// --- Seed tours ---
try {
  const tours = readJSON('tours.json');
  if (tours.length > 0) {
    sql += `-- Seed tours\n`;
    sql += `INSERT INTO tours (id, title, duration, price, persons, status, img, highlights) VALUES\n`;
    const rows = tours.map(t => `  (${t.id}, ${formatVal(t.title)}, ${formatVal(t.duration)}, ${t.price || 0}, ${t.persons || 0}, ${formatVal(t.status)}, ${formatVal(t.img)}, ${formatHighlights(t.highlights)})`);
    sql += rows.join(',\n') + ';\n\n';
  }
} catch (e) {
  console.error('Error seeding tours:', e);
}

// --- Seed inquiries ---
try {
  const inquiries = readJSON('inquiries.json');
  if (inquiries.length > 0) {
    sql += `-- Seed inquiries\n`;
    sql += `INSERT INTO inquiries (id, name, phone, msg, tour, date, time, status) VALUES\n`;
    const rows = inquiries.map(i => `  (${i.id}, ${formatVal(i.name)}, ${formatVal(i.phone)}, ${formatVal(i.msg)}, ${formatVal(i.tour)}, ${formatVal(i.date)}, ${formatVal(i.time)}, ${formatVal(i.status)})`);
    sql += rows.join(',\n') + ';\n\n';
  }
} catch (e) {
  console.error('Error seeding inquiries:', e);
}

// --- Seed blogs ---
try {
  const blogs = readJSON('blogs.json');
  if (blogs.length > 0) {
    sql += `-- Seed blogs\n`;
    sql += `INSERT INTO blogs (id, title, slug, excerpt, content, img, author, category, date, status) VALUES\n`;
    const rows = blogs.map(b => `  (${b.id}, ${formatVal(b.title)}, ${formatVal(b.slug)}, ${formatVal(b.excerpt)}, ${formatVal(b.content)}, ${formatVal(b.img)}, ${formatVal(b.author)}, ${formatVal(b.category)}, ${formatVal(b.date)}, ${formatVal(b.status)})`);
    sql += rows.join(',\n') + ';\n\n';
  }
} catch (e) {
  console.error('Error seeding blogs:', e);
}

fs.writeFileSync(OUTPUT_FILE, sql);
console.log(`✅ Successfully generated ${OUTPUT_FILE}`);
