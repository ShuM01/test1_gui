const API_KEY = "8705b70081389f31836147d1b213f39e";

export function fetchMovieDetails(id) {
  const urls = [
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
  ];

  Promise.allSettled(urls.map(url => fetch(url).then(r => r.json())))
    .then(results => {
      const [details, credits, videos] = results;

      if (details.status === "fulfilled") {
        document.getElementById("movie-title").textContent = details.value.title;
        document.getElementById("movie-overview").textContent = details.value.overview;
        document.getElementById("movie-genres").innerHTML =
          details.value.genres.map(g => `<li>${g.name}</li>`).join("");
      }

      if (credits.status === "fulfilled") {
        document.getElementById("movie-cast").textContent =
          credits.value.cast.slice(0, 5).map(c => c.name).join(", ");
      }

      if (videos.status === "fulfilled") {
        document.getElementById("movie-videos").textContent =
          videos.value.results.slice(0, 2).map(v => v.name).join(", ");
      }
    });
}
