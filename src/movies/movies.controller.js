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

//Read validation middleware. Check if exists
async function movieExists (req, res, next) {
  const {movieId} = req.params
  let movie
  req.originalUrl.includes("theaters")
    ? (movie = await moviesService.readMovieWithTheaters(movieId))
    : (movie = await moviesService.read(movieId));
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
};

async function read (req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
};



module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
};
