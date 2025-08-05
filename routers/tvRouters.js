const express = require("express");

const
    {getActionTvShows,getComedyTvShows,getMysteryTvShows,getDramaTvShows,getCrimeTvShows,getTvShowVideos,getTvShowDetails} 
    = require("../controllers/TvController");

const tvRouter = express.Router();

tvRouter.get("/action",getActionTvShows);
tvRouter.get("/comedy",getComedyTvShows);
tvRouter.get("/mystery",getMysteryTvShows);
tvRouter.get("/drama",getDramaTvShows);
tvRouter.get("/crime",getCrimeTvShows);
tvRouter.get("/:id/videos",getTvShowVideos);
tvRouter.get("/tvShowDetails",getComedyTvShows);

module.exports = tvRouter;