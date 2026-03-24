const API_KEY = "8705b70081389f31836147d1b213f39e";
let debounceTimer;
let controller;
const cache = new Map(); // ✅ Step 4: cache storage
let currentIndex = -1;   // ✅ Step 5: keyboard navigation

export function initSearch(searchBox, resultsList, template, app, onMovieSelect) {
  searchBox.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchMovies(searchBox.value.trim(), resultsList, template, app, onMovieSelect);
    }, 300);
  });

  // ✅ Step 5: keyboard navigation
  searchBox.addEventListener("keydown", e => {
    const items = resultsList.querySelectorAll(".result-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      currentIndex = (currentIndex + 1) % items.length;
      highlight(items);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      highlight(items);
      e.preventDefault();
    } else if (e.key === "Enter" && currentIndex >= 0) {
      items[currentIndex].click();
    }
  });
}

function searchMovies(query, resultsList, template, app, onMovieSelect) {
  if (!query) return;

  // ✅ Step 4: check cache first
  if (cache.has(query)) {
    console.log("Cache hit for:", query);
    renderResults(cache.get(query), resultsList, template, onMovieSelect);
    return;
  }

  // Abort previous request if still running
  if (controller) controller.abort();
  controller = new AbortController();
  app.dataset.loading = "true";

  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`, {
    signal: controller.signal
  })
    .then(res => res.json())
    .then(data => {
      cache.set(query, data.results); // ✅ store results in cache
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
  const frag = new DocumentFragment(); // ✅ Step 3: fragment pattern
  currentIndex = -1; // reset highlight when new results load

  movies.forEach(movie => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".title").textContent = movie.title;
    const item = clone.querySelector(".result-item");
    item.addEventListener("click", () => {
      onMovieSelect(movie.id);
    });
    frag.appendChild(clone);
  });

  resultsList.appendChild(frag);
}

function highlight(items) {
  items.forEach((item, i) => {
    item.classList.toggle("highlight", i === currentIndex);
  });
}
