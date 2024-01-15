const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MjdjNDk2ZTYxMDJhZDQzNmM2ZDRjYWMyMzdiYTM5MCIsInN1YiI6IjY1YTU1Y2Y4OGRiYzMzMDEyNjZhODRmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o4RnAi1xh8_iQxipdwQdNzeQwzfgQN3CdXU8gIlLxss',
  },
};

fetch('https://api.themoviedb.org/3/authentication', options).catch((err) =>
  console.error(err)
);

const globalPath = {
  currentPage: window.location.pathname,
};

function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === globalPath.currentPage) {
      link.classList.add('active');
    }
  });
}

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  // We DOMing this shit

  const popularMoviesGrid = document.getElementById('popular-movies');

  results.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <a href="movie-details.html?id=1">
    <img 
    src="${
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '../images/no-image.jpg'
    }"
    class="card-img-top"
    alt="${movie.name}"
  />
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.original_title}</h5>
      <p class="card-text">
      <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>`;
    popularMoviesGrid.appendChild(card);
  });
}

async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  // We DOMing this shit

  results.forEach((show) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <a href="tv-details.html?id=1">
    <img 
    src="${
      show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : '../images/no-image.jpg'
    }"
    class="card-img-top"
    alt="${show.name}"
  />
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
      <small class="text-muted">Release: ${show.first_air_date}</small>
      </p>
    </div>`;
    document.getElementById('popular-shows').appendChild(card);
  });
}

async function fetchAPIData(endpoint) {
  const API_URL = `https://api.themoviedb.org/3/`;

  try {
    const res = await fetch(
      `${API_URL}${endpoint}?language=en-US&page=1`,
      options
    );

    if (!res.ok) {
      throw new Error(`Http Response error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error: ' + error.message);
  }
}

function init() {
  switch (globalPath.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/movie-details.html':
      console.log('movie details');
      break;
    case '/search.html':
      console.log('search');
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/tv-details.html':
      console.log('Tv-deatils');
      break;
    default:
      console.log('Page not found');
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
