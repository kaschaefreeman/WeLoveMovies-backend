const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/* Validation middleware */

//Read reviewId to see if review exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await reviewsService.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  } else {
    next({ status: 404, message: "Review cannot be found" });
  }
}

//declare valid fields for review instance
const VALID_PROPERTIES = ["content", "score"];

//check if request body has only valid properties of review instance
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  invalidFields.length
    ? next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(",")}`,
      })
    : next();
}

/* Reviews Route allows for READ, UPDATE, DELETE endpoints */

//Read a review record after checking if Exists
function read(req, res, next) {
  const { review: data } = res.locals;
  res.status(200).json({ data });
}

//Update review after checking if exists and has valid properties
//Review is updated first then it is read to return data with critics table information added
async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await reviewsService.update(updatedReview);
  res.status(200).json({
    data: await reviewsService.read(updatedReview.review_id),
  });
}

//Delete a review after checking if the review exists
async function destroy(req, res, next) {
  const { review_id } = res.locals.review;
  await reviewsService.destroy(review_id);
  res.sendStatus(204);
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  update: [
    asyncErrorBoundary(reviewExists),
    hasValidProperties,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
