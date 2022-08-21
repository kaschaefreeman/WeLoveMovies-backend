const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

/* List functions */

//List movies that are showing
function listIsShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .distinct()
    .orderBy("m.movie_id");
}

//list all movies
function list() {
  return knex("movies").select("*");
}

/* Read functions */

//Read movie by id
function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}
//Map properties of critics data to critic object
//to be used to list movies with reviews adding critics data
const addCritics = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  critic_created_at: "critic.created_at",
  critic_updated_at: "critic.updated_at",
});

//Read movie by Id and show all theaters with movie
function readMovieWithTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("*")
    .where({ "m.movie_id": movieId });
}

//Read movie by Id and show all reviews and the critic that wrote the review
function readMovieWithReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select(
      "*",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where({ "m.movie_id": movieId })
    .orderBy("r.review_id")
    .then((data) => data.map(addCritics));
}

module.exports = {
  list,
  listIsShowing,
  read,
  readMovieWithTheaters,
  readMovieWithReviews,
};
