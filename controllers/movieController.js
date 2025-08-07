const { getMediaList,TMDB_ENDPOINT,tmdbBASEURL } =require("../utility/utility");

const getActionMovies= async function(req,res){
    try{
        let movieList;
        if(process.env.NODE_ENV === "development"){
          
            movieList = require("../seedFiles/movies/action.json");
        }else{
            movieList = await getMediaList(TMDB_ENDPOINT.fetchActionMovies);
        }
        res.status(200).json({
            message:"action movies",
            movieList:movieList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
}
const getComedyMovies= async function(req,res){
    try{
         let movieList;
        if(process.env.NODE_ENV === "development"){
            movieList = require("../seedFiles/movies/comedy.json");
        }else{
            movieList = await getMediaList(TMDB_ENDPOINT.fetchComedyMovies);
        }
        res.status(200).json({
            message:"comedy movies",
            movieList:movieList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
}
const getHorrorMovies= async function(req,res){
    try{
         let movieList;
        if(process.env.NODE_ENV === "development"){
           
            movieList = require("../seedFiles/movies/horror.json");
        }else{
            movieList = await getMediaList(TMDB_ENDPOINT.fetchHorrorMovies);
        }
        res.status(200).json({
            message:"horror movies",
            movieList:movieList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
}
const getRomanceMovies= async function(req,res){
    try{
        let movieList;
        if(process.env.NODE_ENV === "development"){
          
            movieList = require("../seedFiles/movies/romance.json");
        }else{
            movieList = await getMediaList(TMDB_ENDPOINT.fetchRomanceMovies);
        }
        res.status(200).json({
            message:"romance movies",
            movieList:movieList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
}
const getAnimeMovies= async function(req,res){
    try{
        let movieList;
        if(process.env.NODE_ENV === "development"){
            
            movieList = require("../seedFiles/movies/anime.json");
        }else{
            movieList = await getMediaList(TMDB_ENDPOINT.fetchAnimeMovies);         
        }
        res.status(200).json({
            message:"Anime movies",
            movieList:movieList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
}
const getMovieVideos= async function(req,res){
    try{
        const {id} = req.params;
        // console.log("id of movie in backened",id);
        if(!id) throw new Error("video id not defined");
        const details = await getMediaList(TMDB_ENDPOINT.fetchMovieVideos(id));
        // console.log("details of movie",details)
         if (!details) {
         return res.status(404).json({ error: "Movie not found" });
        }
        res.status(200).json({
            details:details,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.res.message
        })
    }
}
const getMovieDetails= async function(req,res){
    try{
        const {id} = req.query;
        // console.log("id of movie in backened",id);
        if(!id) throw new Error("video id not defined");
        const details = await getMediaList(TMDB_ENDPOINT.fetchMovieDetails(id));
        // console.log("details of movie",details)
         if (!details) {
         return res.status(404).json({ error: "Movie not found" });
        }
        res.status(200).json({
            details:details,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.res.message
        })
    }
}
module.exports={
    getActionMovies,getComedyMovies,getHorrorMovies,getRomanceMovies,getAnimeMovies,getMovieVideos,getMovieDetails
}