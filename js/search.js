const API_KEY = "8705b70081389f31836147d1b213f39e";
let debounceTimer;
let controller;

export function initSearch(searchBox, resultsList, template, app, onMovieSelect) {
  searchBox.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchMovies(searchBox.value.trim(), resultsList, template, app, onMovieSelect);
    }, 300);
  });
}

function searchMovies(query, resultsList, template, app, onMovieSelect) {
  if (!query) return;

  if (controller) controller.abort();
  controller = new AbortController();
  app.dataset.loading = "true";

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`, {
    signal: controller.signal
  })
    .then(res => res.json())
    .then(data => {
      renderResults(data.results, resultsList, template, onMovieSelect);
    })
    .catch(err => {
      if (err.name !== "AbortError") console.error(err);
    })
    .finally(() => {
      app.dataset.loading = "false";
    });
}

function renderResults(movies, resultsList, template, onMovieSelect) {
  resultsList.innerHTML = "";
  const frag = new DocumentFragment();

  movies.forEach(movie => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".title").textContent = movie.title;
    clone.querySelector(".result-item").addEventListener("click", () => {
      onMovieSelect(movie.id);
    });
    frag.appendChild(clone);
  });

  resultsList.appendChild(frag);
}
