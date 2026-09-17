import fs from 'fs';
import path from 'path';
const dbPath = path.resolve('db.json');
const raw = fs.readFileSync(dbPath,'utf-8');
const db = JSON.parse(raw);
db.products = db.products.map(p=>({
  ...p,
  stock: p.inStock ? 5 : 0
}));
fs.writeFileSync(dbPath, JSON.stringify(db,null,2),'utf-8');
console.log('stock added');
