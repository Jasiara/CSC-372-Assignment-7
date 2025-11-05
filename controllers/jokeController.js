const model = require('../models/jokeModel');
const fetch = require('node-fetch');

async function categories(req, res, next) {
  try {
    const cats = await model.getCategories();
    res.json({ categories: cats });
  } catch (err) {
    next(err);
  }
}

// GET jokes in a category
async function jokesInCategory(req, res, next) {
  try {
    const category = req.params.category;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const catId = await model.getCategoryId(category);
    if (!catId) {
      try {
        const apiUrl = `https://v2.jokeapi.dev/joke/${encodeURIComponent(category)}?type=twopart&amount=3&blacklistFlags=nsfw,religious,political,sexist,explicit`;
        const apiResp = await fetch(apiUrl);
        if (apiResp.ok) {
          const data = await apiResp.json();
          let jokes = [];
          if (data && data.jokes && Array.isArray(data.jokes)) {
            for (const j of data.jokes) {
              if (j.type === 'twopart') {
                await model.createCategory(category);
                await model.addJoke(category, j.setup, j.delivery);
                jokes.push({ setup: j.setup, delivery: j.delivery });
              }
            }
          } else if (data && data.type === 'twopart') {
            await model.createCategory(category);
            await model.addJoke(category, data.setup, data.delivery);
            jokes.push({ setup: data.setup, delivery: data.delivery });
          }
          if (jokes.length > 0) {
            const rows = await model.getJokesByCategory(category, limit);
            return res.json({ category, jokes: rows });
          }
        }
      } catch (e) {
        console.warn('External API fetch failed:', e.message);
      }
      return res.status(404).json({ error: `Category '${category}' not found` });
    }
    const rows = await model.getJokesByCategory(category, limit);
    res.json({ category, jokes: rows });
  } catch (err) {
    next(err);
  }
}


// GET a random joke
async function randomJoke(req, res, next) {
  try {
    const joke = await model.getRandomJoke();
    if (!joke) return res.status(404).json({ error: 'No jokes found' });
    res.json(joke);
  } catch (err) {
    next(err);
  }
}

// POST a new joke
async function addJoke(req, res, next) {
  try {
    const { category, setup, delivery } = req.body;
    if (!category || !setup || !delivery) {
      return res.status(400).json({ error: 'Missing required fields: category, setup, delivery' });
    }
    await model.addJoke(category, setup, delivery);
    const rows = await model.getJokesByCategory(category);
    res.status(201).json({ category, jokes: rows });
  } catch (err) {
    next(err);
  }
}

// DELETE a category
async function deleteCategory(req, res, next) {
  try {
    const category = req.params.category;
    const cat = await model.deleteCategory(category);
    if (!cat) {
      return res.status(404).json({ error: `Category '${category}' not found` });
    }
    res.json({ message: `Category '${category}' and its jokes have been deleted.` });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  categories,
  jokesInCategory,
  randomJoke,
  addJoke,
  deleteCategory
};
