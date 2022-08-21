const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//Configure movies records to be an array of objects for each theater record
const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  movie_created_at: ["movies", null, "created_at"],
  movie_updated_at: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
  movie_theater_id: ["movies", null, "theater_id"],
});

//list all theaters and add movies to data
const list = () => {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select(
      "*",
      "m.created_at as movie_created_at",
      "m.updated_at as movie_updated_at",
      "mt.theater_id as movie_theater_id"
    )
    .then(reduceMovies);
};

module.exports = {
  list,
};
