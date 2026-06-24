async function run() {
  const url = 'http://localhost:3001/api/products/egyptian-cotton-shirt';
  try {
    const res = await fetch(url);
    console.log('STATUS:', res.status);
    console.log('HEADERS:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('BODY:', text);
  } catch (err) {
    console.error('FETCH ERROR:', err);
  }
}
run();
