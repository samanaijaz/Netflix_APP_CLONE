const API_KEY = '46f1847a2ed339539b91256048d6e6e7';
const API_URL = 'https://api.themoviedb.org/3';

// Fetch movie recommendations
async function getMovieRecommendations(movieIds) {
    const url = `${API_URL}/movie/${movieIds.join(',')}/recommendations?api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movie recommendations:', error);
        return [];
    }
}

async function getVisitedMovieIds() {
    try {
        const response = await fetch('/api/visitedMovies');
        const data = await response.json();
        return data.visitedMovies; 
    } catch (error) {
        console.error('Error fetching visited movie IDs:', error);
        return [];
    }
}


// Display movie recommendations on the page
async function displayMovieRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations');
    const visitedMovieIds = await getVisitedMovieIds();
    const recommendations = await getMovieRecommendations(visitedMovieIds);

    
    recommendations.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const linkElement = document.createElement('a');
        linkElement.href = `/${movie.id}`;

        const imgElement = document.createElement('img');
        imgElement.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        imgElement.alt = movie.title;

        const titleElement = document.createElement('h3');
        titleElement.textContent = movie.title;

        const ratingElement = document.createElement('p');
        ratingElement.textContent = `Rating: ${movie.vote_average}`;

        linkElement.appendChild(imgElement);
        linkElement.appendChild(titleElement);
        linkElement.appendChild(ratingElement);

        movieElement.appendChild(linkElement);

        recommendationsContainer.appendChild(movieElement);
    });
    
}

displayMovieRecommendations();
