const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/jokeController');

router.get('/categories', ctrl.categories);
router.get('/category/:category', ctrl.jokesInCategory);
router.get('/random', ctrl.randomJoke);
router.post('/add', ctrl.addJoke);
router.delete('/category/:category', ctrl.deleteCategory);

module.exports = router;
