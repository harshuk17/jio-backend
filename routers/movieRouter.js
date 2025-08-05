const express = require("express");
const 
    {getActionMovies,getComedyMovies,getHorrorMovies,getRomanceMovies,getAnimeMovies,getMovieVideos,getMovieDetails} 
    = require("../controllers/movieController");

const movieRouter = express.Router();

movieRouter.get("/action",getActionMovies);
movieRouter.get("/comedy",getComedyMovies);
movieRouter.get("/horror",getHorrorMovies);
movieRouter.get("/romance",getRomanceMovies);
movieRouter.get("/anime",getAnimeMovies);
// movieRouter.get("/moviesVideo",getMovieVideos);
movieRouter.get("/details",getMovieDetails);
movieRouter.get("/:id/videos", getMovieVideos);

module.exports = movieRouter;
