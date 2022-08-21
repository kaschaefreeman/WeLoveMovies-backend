const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//List all movies with option for query if movie is showing in theaters
async function list(req, res, next) {
  let data;
  const { is_showing } = req.query;
  is_showing
    ? (data = await moviesService.listIsShowing())
    : (data = await moviesService.list());
  res.json({ data });
}

/* Read movieId middleware */

//Read validation middleware.  Checks the route and calls the corresponding service for that route
async function checkMovieByRoute(req, res, next) {
  const { movieId } = req.params;
  switch (req.originalUrl) {
    case `/movies/${movieId}/theaters`:
      res.locals.movieCheck = await moviesService.readMovieWithTheaters(
        movieId
      );
      next();
      break;
    case `/movies/${movieId}/reviews`:
      res.locals.movieCheck = await moviesService.readMovieWithReviews(movieId);
      next();
      break;
    default:
      res.locals.movieCheck = await moviesService.read(movieId);
      next();
      break;
  }
}

//Read validation middleware. Check if data was found while pulling the movie by the route
async function movieExists(req, res, next) {
  const { movieCheck } = res.locals;
  if (movieCheck) {
    res.locals.movie = movieCheck;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function read(req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(checkMovieByRoute),
    asyncErrorBoundary(movieExists),
    read,
  ],
};
