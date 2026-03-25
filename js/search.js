import { fetchMovieDetails } from "./details.js";

export function initSearch(searchInput, resultList, template, statusBar) {
  let activeIndex = -1;
  let searchTimeout;


  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = searchInput.value.trim();
      if (!query) {
        resultList.innerHTML = "";
        statusBar.textContent = "CLEARED";
        activeIndex = -1;
        return;
      }
  
      searchMovies(query, resultList, template, statusBar);
    }, 300);
  });

  searchInput.addEventListener("keydown", e => {
  const items = resultList.querySelectorAll(".result-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = Math.min(activeIndex + 1, items.length - 1);
    setActive(activeIndex, items);
    items[activeIndex].scrollIntoView({ block: "nearest" });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = Math.max(activeIndex - 1, 0);
    setActive(activeIndex, items);
    items[activeIndex].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter" && activeIndex >= 0) {
    e.preventDefault();
    items[activeIndex].click();
  } else if (e.key === "Escape") {
    e.preventDefault();
    resultList.innerHTML = "";
    activeIndex = -1;
    statusBar.textContent = "CLEARED";
  }
});

function setActive(idx, items) {
  items.forEach((el, i) => {
    el.classList.toggle("active", i === idx);
  });
}


const API_KEY = "8705b70081389f31836147d1b213f39e";

function searchMovies(query, resultList, template, statusBar) {


  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`, {
    cache: "no-store"
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("Search data:", data); // Debugging log

      resultList.innerHTML = "";

      if (!data || !data.results || !data.results.length) {
        statusBar.textContent = "NO RESULTS";
        return;
      }

      const frag = new DocumentFragment();
      data.results.slice(0, 10).forEach(movie => {
        const clone = template.content.cloneNode(true);
        const item = clone.querySelector(".result-item");

        const titleEl = item.querySelector(".result-title");
        if (titleEl) titleEl.textContent = movie.title || "Untitled";

        const metaEl = item.querySelector(".result-meta");
        if (metaEl) {
          const year = movie.release_date ? movie.release_date.slice(0, 4) : "----";
          const lang = movie.original_language ? movie.original_language.toUpperCase() : "--";
          metaEl.textContent = `${year} · ${lang}`;
        }

        const ratingEl = item.querySelector(".result-rating");
        if (ratingEl) ratingEl.textContent = movie.vote_average ? `★${movie.vote_average}` : "";

        const poster = item.querySelector(".result-poster");
        if (poster) {
          if (movie.poster_path) {
            poster.src = `https://image.tmdb.org/t/p/w92${movie.poster_path}`;
          } else {
            poster.src = "";
            poster.alt = "No poster";
          }
        }

        item.addEventListener("click", () => {
          fetchMovieDetails(movie.id);
          resultList.querySelectorAll(".result-item").forEach(el => el.classList.remove("active"));
          item.classList.add("active");
        });

        frag.appendChild(clone);
      });

      resultList.appendChild(frag);
    })
    .catch(err => {
      console.error("Search error:", err);
      statusBar.textContent = `SEARCH FAILED (${err.message})`;
    });
}}