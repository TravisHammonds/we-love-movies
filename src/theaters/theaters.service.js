const knex = require("../db/connection");

function list() {
  return knex("theaters");
}

function findMoviesByTheater(theaterId) {
  return knex("movies_theaters as mt")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .where({ "mt.theater_id": theaterId })
    .select("m.*");
}

module.exports = {
  list,
  findMoviesByTheater,
};
