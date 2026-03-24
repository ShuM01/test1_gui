export function fetchMovieDetails(id) {
  const urls = [
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
  ];

  Promise.allSettled(urls.map(url => fetch(url).then(res => res.json())))
    .then(results => {
      const [details, credits, videos] = results;

      if (details.status === "fulfilled") {
        document.getElementById("movie-title").textContent = details.value.title;
        document.getElementById("movie-overview").textContent = details.value.overview;

        // ✅ Safe genre rendering
        const genresList = document.getElementById("movie-genres");
        genresList.innerHTML = "";
        details.value.genres.forEach(g => {
          const li = document.createElement("li");
          li.textContent = g.name; // safe assignment
          genresList.appendChild(li);
        });
      }

      if (credits.status === "fulfilled") {
        const castList = document.getElementById("movie-cast");
        castList.innerHTML = "";
        credits.value.cast.slice(0, 5).forEach(c => {
          const li = document.createElement("li");
          li.textContent = c.name; // safe assignment
          castList.appendChild(li);
        });
      }

      if (videos.status === "fulfilled") {
        const videoList = document.getElementById("movie-videos");
        videoList.innerHTML = "";
        videos.value.results.slice(0, 3).forEach(v => {
          const li = document.createElement("li");
          li.textContent = v.name; // safe assignment
          videoList.appendChild(li);
        });
      }
    });
}
