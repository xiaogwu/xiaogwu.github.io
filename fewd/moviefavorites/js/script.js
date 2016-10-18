var form = document.querySelector("form");
var searchButton = document.querySelector("input[type=submit");
var movieSearchList = document.querySelector(".movie-search-list");
var moviesView = document.querySelector(".movies-view");
var moviePosters = document.querySelector(".movie-posters");
var moviePosterImages = document.querySelector(".movie-poster-images");
var movieInfo = document.querySelector(".movie-info");
var noMoviesFound = document.querySelector(".no-moview-found");
var searchAgainButton = document.querySelector("button");
var movieTitle = document.querySelector(".movie-title");
var movieYear = document.querySelector(".movie-year");
var movieRated = document.querySelector(".movie-rated");
var movieRuntime = document.querySelector(".movie-runtime");
var moviePlot = document.querySelector(".movie-plot");

function updateMovieInfo(event) {
  movieTitle.textContent = event.target.dataset.title;
  movieYear.textContent = event.target.dataset.year;
  movieRated.textContent = event.target.dataset.rated;
  movieRuntime.textContent = event.target.dataset.runtime;
  moviePlot.textContent = event.target.dataset.plot;
}

function addMovieImage(movie) {
  if (movie.Poster !== 'N/A') {
    var img = document.createElement("img");
    img.setAttribute("height", "208px");
    img.setAttribute("src", "https://crossorigin.me/" + movie.Poster);
    img.setAttribute("data-title", movie.Title);
    img.setAttribute("data-year", movie.Year);
    img.setAttribute("data-rated", movie.Rated);
    img.setAttribute("data-runtime", movie.Runtime);
    img.setAttribute("data-plot", movie.Plot);
    moviePosterImages.appendChild(img);
    img.addEventListener("click", updateMovieInfo);
  }
}

function getMovie(title) {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    return false;
  }

  var url = 'http://www.omdbapi.com/?t=' + title;

  function handleResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        moviesView.classList.remove("hidden");
        if (httpRequest.response.Response !== 'False') {
          addMovieImage(httpRequest.response);
          var clickImage = document.querySelector("img");
          clickImage.click();
        }
      } else {
        console.log("Error");
      }
    }
  }
  httpRequest.responseType = 'json';
  httpRequest.onreadystatechange = handleResponse;
  httpRequest.open('GET', url);
  httpRequest.send();
}

function searchMovies(event) {
  event.preventDefault();
  var movieTitles = document.querySelectorAll(".movie");

  for (var i = 0; i < movieTitles.length; i++) {
    if (movieTitles[i].value.length > 0) {
      getMovie(movieTitles[i].value)
    }
  }
  form.reset();
  movieSearchList.classList.add("hidden");
}

function searchAgain(event) {
  event.preventDefault();
  document.location.reload(true);
}

searchButton.addEventListener("click", searchMovies);
searchAgainButton.addEventListener("click", searchAgain);
