const { getMediaList,TMDB_ENDPOINT,tmdbBASEURL } =require("../utility/utility");

const getActionTvShows = async function(req,res){
    try{
        let TvList;
        if(process.env.NODE_ENV === "development"){

            TvList = require("../seedFiles/tv/action.json");
        }else{
            TvList = await getMediaList(TMDB_ENDPOINT.fetchActionTvShows);
        }
        res.status(200).json({
            message:"action TV shows",
            TvList:TvList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
    
}
const getComedyTvShows = async function(req,res){
    try{
        let TvList;
        if(process.env.NODE_ENV === "development"){
          
            TvList = require("../seedFiles/tv/comedy.json");
        }else{
            TvList = await getMediaList(TMDB_ENDPOINT.fetchComedyTvShows);
        }
        res.status(200).json({
            message:"comedy TV shows",
            TvList:TvList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
    
}
const getMysteryTvShows = async function(req,res){
    try{
        let TvList;
        if(process.env.NODE_ENV === "development"){
         
            TvList = require("../seedFiles/tv/mystery.json");
        }else{
            TvList = await getMediaList(TMDB_ENDPOINT.fetchMysteryTvShows);
        }
        res.status(200).json({
            message:"mystery TV shows",
            TvList:TvList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
    
}
const getDramaTvShows = async function(req,res){
    try{
        let TvList;
        if(process.env.NODE_ENV === "development"){
         
            TvList = require("../seedFiles/tv/drama.json");
        }else{
            TvList = await getMediaList(TMDB_ENDPOINT.fetchDramaTvShows);
        }
        res.status(200).json({
            message:"Drama TV shows",
            TvList:TvList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
    
}
const getCrimeTvShows = async function(req,res){
    try{
        let TvList;
        if(process.env.NODE_ENV === "development"){
       
            TvList = require("../seedFiles/tv/crime.json");
        }else{
            TvList = await getMediaList(TMDB_ENDPOINT.fetchCrimeTvShows);
        }
        res.status(200).json({
            message:"crime TV shows",
            TvList:TvList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
    
}
const getTvShowVideos = async function(req,res){
    try{
        const tvShowId= req.params.id;
        console.log("tv-Show-Id",tvShowId);
        const TvList = await getMediaList(TMDB_ENDPOINT.fetchTvShowVideos(tvShowId));
        console.log("response of Tv list in backend",TvList);
        res.status(200).json({
            message:" TV show videos",
            TvList:TvList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
    
}
const getTvShowDetails = async function(req,res){
    try{
        const {id} =req.query;
        if(!id) throw new Error("video id not defined");
        const TvList = await getMediaList(TMDB_ENDPOINT.fetchTvShowDetails(id));
        res.status(200).json({
            message:" TV show details",
            TvList:TvList,
            status:"success"
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
    
}
module.exports={
    getActionTvShows,getComedyTvShows,getMysteryTvShows,getDramaTvShows,getCrimeTvShows,getTvShowVideos,getTvShowDetails
}