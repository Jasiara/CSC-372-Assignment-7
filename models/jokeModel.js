const db = require('../db');

async function getCategories() {
  const res = await db.query('SELECT name FROM categories ORDER BY name');
  return res.rows.map(r => r.name);
}

async function getCategoryId(name) {
  const res = await db.query('SELECT id FROM categories WHERE name=$1', [name]);
  if (res.rowCount === 0) return null;
  return res.rows[0].id;
}

async function createCategory(name) {
  const res = await db.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id, name', [name]);
  if (res.rowCount > 0) return res.rows[0];
  const id = await getCategoryId(name);
  return { id, name };
}

async function getJokesByCategory(name, limit) {
  if (limit && Number.isInteger(limit)) {
    const res = await db.query('SELECT j.id, j.setup, j.delivery FROM jokes j JOIN categories c ON j.category_id = c.id WHERE c.name = $1 ORDER BY j.id LIMIT $2', [name, limit]);
    return res.rows;
  } else {
    const res = await db.query('SELECT j.id, j.setup, j.delivery FROM jokes j JOIN categories c ON j.category_id = c.id WHERE c.name = $1 ORDER BY j.id', [name]);
    return res.rows;
  }
}

async function addJoke(categoryName, setup, delivery) {
  let catId = await getCategoryId(categoryName);
  if (!catId) {
    const created = await createCategory(categoryName);
    catId = created.id;
  }
  const res = await db.query('INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3) RETURNING id, setup, delivery', [catId, setup, delivery]);
  return res.rows[0];
}

async function getRandomJoke() {
  const res = await db.query('SELECT j.id, c.name as category, j.setup, j.delivery FROM jokes j JOIN categories c ON j.category_id=c.id ORDER BY RANDOM() LIMIT 1');
  return res.rows[0];
}

async function deleteCategory(name) {
  // Delete the category (and its jokes if you have ON DELETE CASCADE)
  const res = await db.query('DELETE FROM categories WHERE name=$1 RETURNING id, name', [name]);
  if (res.rowCount === 0) return null;
  return res.rows[0]; // return deleted category info
}

module.exports = {
  getCategories,
  getJokesByCategory,
  addJoke,
  getRandomJoke,
  getCategoryId,
  createCategory,
  deleteCategory   
};

