const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");
const mapProperties = require("../utils/map-properties");

const mapCriticProperties = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//validator
async function checkReviewExists(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await service.read(reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  return next({
    status: 404,
    message: "Review cannot be found.",
  });
}

async function destroy(req, res, next) {
  const { reviewId } = req.params;
  await service.destroy(reviewId);
  res.sendStatus(204);
}

async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await service.update(updatedReview);

  // Fetch the review again from the database to verify the update
  const data = await service.read(updatedReview.review_id);

  // Fetch the critic information using the critic_id from updatedReview
  const criticData = await service.readCritic(updatedReview.critic_id);

  // Map the critic data using our configuration
  const mappedCriticData = mapCriticProperties(criticData);

  const response = {
    ...data,
    critic: mappedCriticData.critic,
  };

  res.json({ data: response });
}

module.exports = {
  delete: [asyncErrorBoundary(checkReviewExists), destroy],
  update: [asyncErrorBoundary(checkReviewExists), update],
};
