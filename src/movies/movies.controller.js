const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  let data;
  if (req.query.is_showing) {
    data = await moviesService.listIsShowing();
  } else {
    data = await moviesService.list();
  }
  res.json({ data });
}

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
