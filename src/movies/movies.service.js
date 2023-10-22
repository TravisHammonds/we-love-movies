const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list(isShowing) {
  if (isShowing === "true") {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.*")
      .groupBy("m.movie_id")
      .where({ is_showing: true });
  } else {
    return knex("movies").select("*");
  }
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId });
}

function listTheatersForMovie(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "m.movie_id", "mt.is_showing")
    .where({
      "mt.movie_id": movieId,
      is_showing: true,
    });
}

function listReviewsForMovie(movieId) {
    return knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.*", "c.*")
      .where({"r.movie_id": movieId})
      .then(reviews => reviews.map(review => {
        const criticData = addCritic(review);
        return {
          review_id: review.review_id,
          content: review.content,
          score: review.score,
          created_at: review.created_at,
          updated_at: review.updated_at,
          critic_id: review.critic_id,
          movie_id: review.movie_id,
          critic: criticData.critic
        };
      }));
  }  

module.exports = {
  list,
  read,
  listTheatersForMovie,
  listReviewsForMovie,
};
