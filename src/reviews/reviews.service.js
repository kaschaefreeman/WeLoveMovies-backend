const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//map critics table to be object added to reviews data
const addCritics = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//Read a review record with critics object added
function read(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ review_id: reviewId })
    .first()
    .then(addCritics);
}

//Update an existing review record
function update(updatedReview) {
  return knex("reviews ")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

//Delete a review record
function destroy(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .del()
    .then((deletedRecords) => deletedRecords[0]);
}

module.exports = {
  read,
  update,
  destroy,
};
