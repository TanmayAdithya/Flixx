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
  search: {
    type: '',
    page: 1,
    totalPages: 1,
    term: '',
  },
};

function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === globalPath.currentPage) {
      link.classList.add('active');
    }
  });
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  globalPath.search.type = urlParams.get('type');
  globalPath.search.term = urlParams.get('search-term');

  if (globalPath.search.term !== '' && globalPath.search.term !== null) {
    const { results, page, total_pages, total_results } = await fetchAPIData(
      `search/movie?query=${globalPath.search.term}&include_adult=false&language=en-US&page=${globalPath.search.page}`
    );

    globalPath.search.page = page;
    globalPath.search.totalPages = total_pages;
    globalPath.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No Results');
      return;
    }

    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term', 'error');
  }
}

function displaySearchResults(results) {
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="${globalPath.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500${result.poster_path}"
              class="card-img-top"
              alt="${
                globalPath.search.type === 'movie' ? result.title : result.name
              }"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
             alt="${
               globalPath.search.type === 'movie' ? result.title : result.name
             }"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              globalPath.search.type === 'movie' ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                globalPath.search.type === 'movie'
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
        `;

    document.querySelector('#search-results-heading').innerHTML = `
              <h2>${results.length} of ${globalPath.search.totalResults} Results for ${globalPath.search.term}</h2>
    `;

    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${globalPath.search.page} of ${globalPath.search.totalPages}</div>`;
  document.getElementById('pagination').appendChild(div);

  if (globalPath.search.page === 1) {
    document.getElementById('prev').disabled = true;
  }

  if (globalPath.search.page === globalPath.search.totalPages) {
    document.getElementById('next').disabled = true;
  }

  document.getElementById('prev').addEventListener('click', async function () {
    if (globalPath.search.page > 1) {
      globalPath.search.page--;
      const { results } = await fetchAPIData(
        `search/movie?query=${globalPath.search.term}&include_adult=false&language=en-US&page=${globalPath.search.page}`
      );

      displaySearchResults(results);
    }
  });

  document.getElementById('next').addEventListener('click', async function () {
    globalPath.search.page++;
    const { results } = await fetchAPIData(
      `search/movie?query=${globalPath.search.term}&include_adult=false&language=en-US&page=${globalPath.search.page}`
    );

    displaySearchResults(results);
  });
}

function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  const alertContainer = document.querySelector('#alert');
  alertContainer.appendChild(alertEl);
  setTimeout(() => {
    alertContainer.removeChild(alertEl);
  }, 3000);
}

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  // We DOMing this shit
  const popularMoviesGrid = document.getElementById('popular-movies');

  results.forEach((movie) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
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
    <a href="tv-details.html?id=${show.id}">
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

async function displayMovieDetails() {
  const movieId = window.location.search;
  const details = await fetchAPIData(`movie/${movieId.substring(4)}`);

  const detailsOutput = document.querySelector('#movie-details');
  displayBackgroundImage('movie', details.backdrop_path);
  detailsOutput.innerHTML = `
    <div class="details-top">
    <div>
      <img
        src="${
          details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : '../images/no-image.jpg'
        }"
        class="card-img-top"
        alt="${details.original_title}"
      />
    </div>
    <div>
      <h2>${details.original_title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${details.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${details.release_date}</p>
      <p>
       ${details.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${details.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
        details.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
        details.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        details.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${details.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${details.production_companies
      .map((com) => `${com.name}`)
      .join(', ')}</div>
  </div>`;
}

async function displayShowDetails() {
  const showId = window.location.search;
  const details = await fetchAPIData(`tv/${showId.substring(4)}`);
  console.log(details);
  const detailsOutput = document.querySelector('#show-details');
  displayBackgroundImage('show', details.backdrop_path);
  detailsOutput.innerHTML = `
  <div class="details-top">
    <div>
      <img
      src="${
        details.poster_path
          ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
          : '../images/no-image.jpg'
      }"
        class="card-img-top"
        alt="${details.name}"
      />
    </div>
    <div>
      <h2>${details.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${details.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${details.first_air_date}</p>
      <p>
        ${details.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${details.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="#" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
        details.number_of_episodes
      }</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${
          details.last_episode_to_air.air_date
        }
      </li>
      <li><span class="text-secondary">Status:</span> ${details.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${details.production_companies
      .map((com) => `${com.name}`)
      .join(', ')}</div>
  </div>
    `;
}

function addCommasToNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    // document.querySelector('#movie-details').appendChild(overlayDiv);
    document.body.appendChild(overlayDiv);
  } else {
    // document.querySelector('#show-details').appendChild(overlayDiv);
    document.body.appendChild(overlayDiv);
  }
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

async function fetchAPIData(endpoint) {
  const API_URL = `https://api.themoviedb.org/3/`;

  try {
    showSpinner();
    const res = await fetch(`${API_URL}${endpoint}`, options);

    if (!res.ok) {
      throw new Error(`Http Response error: ${res.status}`);
    }

    const data = await res.json();
    hideSpinner();
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
      displayMovieDetails();
      break;
    case '/search.html':
      search();
      break;
    case '/shows.html':
      displayPopularShows();
      break;
    case '/tv-details.html':
      displayShowDetails();
      break;
    default:
      console.log('Page not found');
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
