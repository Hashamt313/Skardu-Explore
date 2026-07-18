async function check() {
  try {
    const res = await fetch('https://yuqaegqgtqnevlhcptfz.supabase.co');
    console.log('Status:', res.status);
    console.log('Headers:', [...res.headers.entries()]);
  } catch (err) {
    console.error('Error:', err);
  }
}
check();
