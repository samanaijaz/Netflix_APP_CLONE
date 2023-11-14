const form = document.getElementById('searchForm');
const searchText = document.getElementById('searchText');
const results = document.getElementById('results');

const API_KEY = '46f1847a2ed339539b91256048d6e6e7';
const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchTerm = searchText.value;
    const response = await fetch(API_URL + searchTerm);
    const data = await response.json();

    results.innerHTML = '';

    data.results.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
        <div onclick="location.href = '/${movie.id}'">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      </div>
    `;

        results.appendChild(movieEl);
    });
});