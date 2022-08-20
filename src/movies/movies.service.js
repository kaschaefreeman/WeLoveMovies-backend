const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function listIsShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .distinct()
    .orderBy("m.movie_id");
}

function list() {
  return knex("movies").select("*");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function readMovieWithTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.*")
    .where({ "m.movie_id": movieId });
}

module.exports = {
  list,
  listIsShowing,
  read,
  readMovieWithTheaters,
};
