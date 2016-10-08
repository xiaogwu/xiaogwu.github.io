var form = document.querySelector("form");
var searchButton = document.querySelector("input[type=submit");
var movieSearchList = document.querySelector(".movie-search-list");
var moviesView = document.querySelector(".movies-view");
var moviePosters = document.querySelector(".movie-posters");
var moviePosterImages = document.querySelector(".movie-poster-images");
var movieInfo = document.querySelector(".movie-info");
var noMoviesFound = document.querySelector(".no-moview-found");
var searchAgain = document.querySelectorAll("button");

function addMovie(movie) {

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
        console.log(httpRequest.response);
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

searchButton.addEventListener("click", searchMovies)
