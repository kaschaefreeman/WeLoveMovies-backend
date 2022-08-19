const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//List all movies with option for query if movie is showing in theaters
async function list(req, res, next) {
  let data;
  const { is_showing } = req.query;
  is_showing
    ? (data = await moviesService.listShowing())
    : (data = await moviesService.list());
  res.json({ data });
}

/* Read movieId middleware */

//Read validation middleware. Check if exists
const movieExists = async (req, res, next) => {
  const movie = await moviesService.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
};

const read = (req, res, next) => {
  const { movie: data } = res.locals;
  res.json({ data });
};

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
};
