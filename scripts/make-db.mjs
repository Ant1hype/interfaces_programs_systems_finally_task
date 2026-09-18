import fs from 'fs';
import path from 'path';

// учебный проект
function djb2(str) {
  let hash = 5381;
  const s = String(str || '');
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) + hash) + s.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

const dbPath = path.resolve('db.json');
const raw = fs.readFileSync(dbPath, 'utf-8');
const db = JSON.parse(raw);
db.products = db.products.map(p => ({
  ...p,
  stock: p.inStock ? 5 : 0
}));

if (!db.users || !Array.isArray(db.users)) {
  db.users = [];
}

const demoExists = db.users.some(u => u.id === 1 || u.email === 'demo@cheesecraft.ru');
if (!demoExists) {
  db.users.unshift({
    id: 1,
    name: 'Демо',
    email: 'demo@cheesecraft.ru',
    phone: '+7 (999) 123-45-67',
    passHash: djb2('demo1234'),
    createdAt: new Date().toISOString()
  });
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('stock added and users seeded');

