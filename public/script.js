async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loadRandom() {
  try {
    const j = await getJSON('/jokebook/random');
    document.getElementById('randomJoke').innerText = j.setup + '\n' + j.delivery;
  } catch (e) {
    document.getElementById('randomJoke').innerText = 'Error loading random joke';
  }
}

async function loadCategories() {
  try {
    const data = await getJSON('/jokebook/categories');
    const container = document.getElementById('catList');
    container.innerHTML = '';
    data.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.innerText = cat;
      btn.onclick = () => loadCategory(cat);
      container.appendChild(btn);
    });
  } catch (e) {
    alert('Unable to load categories');
  }
}

async function loadCategory(category) {
  try {
    const q = new URLSearchParams();
    const url = '/jokebook/category/' + encodeURIComponent(category);
    const data = await getJSON(url);
    document.getElementById('currentCategory').innerText = category;
    const list = document.getElementById('jokeList');
    list.innerHTML = '';
    data.jokes.forEach(j => {
      const div = document.createElement('div');
      div.className = 'joke';
      div.innerText = j.setup + '\n' + j.delivery;
      list.appendChild(div);
    });
  } catch (e) {
    alert('Category not found or error');
  }
}

document.getElementById('refreshRandom').addEventListener('click', loadRandom);
document.getElementById('loadCategories').addEventListener('click', loadCategories);
document.getElementById('searchBtn').addEventListener('click', () => {
  const cat = document.getElementById('searchInput').value.trim();
  if (cat) loadCategory(cat);
});
document.getElementById('addForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const category = document.getElementById('catField').value.trim();
  const setup = document.getElementById('setupField').value.trim();
  const delivery = document.getElementById('deliveryField').value.trim();
  try {
    const res = await fetch('/jokebook/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, setup, delivery })
    });
    if (!res.ok) {
      const txt = await res.text();
      alert('Add failed: ' + txt);
      return;
    }
    const data = await res.json();
    document.getElementById('addResult').innerText = 'Added! Showing category ' + data.category;
    loadCategory(data.category);
  } catch (e) {
    alert('Error adding joke');
  }
});

// initial load
loadRandom();
