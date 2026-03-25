const API_KEY = "8705b70081389f31836147d1b213f39e";

export function fetchMovieDetails(id) {
  const urls = [
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`,
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`,
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
  ];

  Promise.allSettled(urls.map(url => fetch(url).then(res => res.json())))
    .then(results => {
      const [details, credits, videos] = results;

      // --- Movie details ---
      if (details.status === "fulfilled") {
        const d = details.value;
        document.getElementById("detail-title").textContent = d.title;
        document.getElementById("detail-tagline").textContent = d.tagline || "";
        document.getElementById("detail-overview").textContent = d.overview;

        const badges = document.getElementById("detail-badges");
        badges.innerHTML = "";
        const yearBadge = document.createElement("span");
        yearBadge.className = "badge accent";
        yearBadge.textContent = d.release_date?.slice(0,4) || "----";
        badges.appendChild(yearBadge);
        d.genres.forEach(g => {
          const b = document.createElement("span");
          b.className = "badge";
          b.textContent = g.name;
          badges.appendChild(b);
        });

        const bdWrap = document.getElementById("detail-backdrop-wrap");
        bdWrap.innerHTML = "";
        if (d.backdrop_path) {
          const img = document.createElement("img");
          img.className = "detail-backdrop";
          img.src = `https://image.tmdb.org/t/p/w780${d.backdrop_path}`;
          bdWrap.appendChild(img);
        } else {
          const ph = document.createElement("div");
          ph.className = "detail-backdrop-placeholder";
          ph.textContent = "🎬";
          bdWrap.appendChild(ph);
        }

        const posterWrap = document.getElementById("detail-poster-wrap");
        posterWrap.innerHTML = "";
        if (d.poster_path) {
          const img = document.createElement("img");
          img.className = "detail-poster";
          img.src = `https://image.tmdb.org/t/p/w342${d.poster_path}`;
          posterWrap.appendChild(img);
        } else {
          const ph = document.createElement("div");
          ph.className = "detail-poster-placeholder";
          ph.textContent = "🎬";
          posterWrap.appendChild(ph);
        }
      }

      // --- Credits ---
      if (credits.status === "fulfilled") {
        const castGrid = document.getElementById("detail-cast");
        castGrid.innerHTML = "";
        const frag = new DocumentFragment();
        credits.value.cast.slice(0, 8).forEach(c => {
          const item = document.createElement("div");
          item.className = "cast-item";

          const avatar = document.createElement("div");
          avatar.className = "cast-avatar";
          if (c.profile_path) {
            const img = document.createElement("img");
            img.src = `https://image.tmdb.org/t/p/w92${c.profile_path}`;
            avatar.appendChild(img);
          } else {
            avatar.textContent = c.name[0];
          }

          const name = document.createElement("div");
          name.className = "cast-name";
          name.textContent = c.name;

          const char = document.createElement("div");
          char.className = "cast-char";
          char.textContent = c.character;

          item.appendChild(avatar);
          item.appendChild(name);
          item.appendChild(char);
          frag.appendChild(item);
        });
        castGrid.appendChild(frag);
      }

      // --- Videos / Trailer ---
      if (videos.status === "fulfilled") {
        const trailerEl = document.getElementById("detail-trailer");
        trailerEl.innerHTML = "";
        const trailer = videos.value.results.find(v => v.type === "Trailer");
        if (trailer) {
          const btn = document.createElement("button");
          btn.className = "trailer-btn";
          btn.textContent = "Watch Trailer";
          btn.onclick = () => {
            window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
          };
          trailerEl.appendChild(btn);
        } else {
          const msg = document.createElement("p");
          msg.className = "trailer-failed";
          msg.textContent = "Trailer unavailable - videos endpoint returned no results.";
          trailerEl.appendChild(msg);
        }
      }

      // --- Show content ---
      document.getElementById("detail-empty").style.display = "none";
      const detailContent = document.getElementById("detail-content");
      detailContent.classList.remove("visible");
      void detailContent.offsetWidth; // reflow for animation
      detailContent.classList.add("visible");
    });
}
