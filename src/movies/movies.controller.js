const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validators

async function checkMovieExists(req, res, next) {
  const { movieId } = req.params;
  const foundMovie = await service.read(movieId);
  if (foundMovie.length) {
    res.locals.movie = foundMovie;
    return next();
  }
  return next({
    status: 404,
    message: "Movie cannot be found.",
  });
}

//middleware

async function list(req, res, next) {
  const isShowing = req.query.is_showing;
  const data = await service.list(isShowing);
  res.json({ data });
}

async function read(req, res, next) {
  const { movie } = res.locals;
  res.json({ data: movie[0] });
}

async function listTheatersForMovie(req, res, next) {
  const { movieId } = req.params;
  const theaters = await service.listTheatersForMovie(movieId);
  res.json({ data: theaters });
}

async function listReviewsForMovie(req, res, next) {
  const { movieId } = req.params;
  const data = await service.listReviewsForMovie(movieId);
  res.json({ data });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(checkMovieExists), read],
  listTheatersForMovie: [
    asyncErrorBoundary(checkMovieExists),
    listTheatersForMovie,
  ],
  listReviewsForMovie: [
    asyncErrorBoundary(checkMovieExists),
    listReviewsForMovie,
  ],
};
