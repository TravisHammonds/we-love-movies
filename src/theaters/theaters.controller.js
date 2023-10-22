const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./theaters.service");
const reduceProperties = require("../utils/reduce-properties");

async function list(req, res, next) {
  const theaters = await service.list();
  const promises = theaters.map(async (theater) => {
    theater.movies = await service.findMoviesByTheater(theater.theater_id);
    return theater;
  });

  const theatersWithMovies = await Promise.all(promises);

  const reduceMovies = reduceProperties("theater_id", {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    rating: ["movies", null, "rating"],
  });

  res.json({ data: reduceMovies(theatersWithMovies) });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
