const express = require("express")
const 
    {getNowPlaying,getTopRated,getPopular,getUpcoming,getTrending}
    =require( "../controllers/homeController");

const homeRouter = express.Router();

homeRouter.get("/nowPlaying",getNowPlaying);
homeRouter.get("/popular",getPopular);
homeRouter.get("/topRated",getTopRated); //this route is not fetching any data from server because the data for this route is not present at server 
homeRouter.get("/trending",getTrending);
homeRouter.get("/upcoming",getUpcoming);;

module.exports=homeRouter;