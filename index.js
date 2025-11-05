require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const jokebookRoutes = require('./routes/jokeRoutes');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static
app.use(express.static(path.join(__dirname, 'public')));

// api routes
app.use('/jokebook', jokebookRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});


// starts server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
