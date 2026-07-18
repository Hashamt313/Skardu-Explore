// Local development server entry point
// For production/Vercel, see api/index.js
import app from './app.js';

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Skardu Explore Backend running at http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/fleet`);
  console.log(`   API: http://localhost:${PORT}/api/tours`);
  console.log(`   API: http://localhost:${PORT}/api/inquiries`);
});
