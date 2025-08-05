const { getMediaList,TMDB_ENDPOINT,tmdbBASEURL } =require("../utility/utility");

const getNowPlaying  = async function(req,res){
    try{
        // const endpoint = "movie/now_playing?language=en-US&page=1"
        let homeList;
        if(process.env.NODE_ENV === "development"){
            homeList = require("../seedFiles/home/nowPlaying.json")
        }else{
            homeList = await getMediaList(TMDB_ENDPOINT.fetchNowPlaying);
        }
        res.status(200).json({
            message:"movie list was fetched",
            status:"succes",
            homeList:homeList
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error occured",
            error:err.message
        })
    }
}
const getTopRated = async function(req,res){
       try{
        let homeList;
        if(process.env.NODE_ENV === "development"){
      
            homeList = require("../seedFiles/home/trending.json")
        }else{
            homeList = await getMediaList(tmdbBASEURL.fetchTopRated);
        }
        // const endpoint = "movie/now_playing?language=en-US&page=1"
        res.status(200).json({
            message:"movie list was fetched",
            status:"succes",
            homeList:homeList
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error occured",
            error:err.message
        })
    }
}
const getPopular = async function(req,res){
      try{
         let homeList;
        if(process.env.NODE_ENV === "development"){

            homeList = require("../seedFiles/home/popular.json")
        }else{
            homeList = await getMediaList(TMDB_ENDPOINT.fetchPopular);
        }
        res.status(200).json({
            message:"popular movie list was fetched",
            status:"succes",
            homeList:homeList
        })
    }catch(err){
        res.status(500).json({
            message:"internal server error occured",
            error:err.message
        })
    }
}
const getTrending = async function (req,res){
    try{
         let homeList;
        if(process.env.NODE_ENV === "development"){
     
            homeList = require("../seedFiles/home/trending.json")
        }else{
            homeList= await getMediaList(TMDB_ENDPOINT.fetchTrending);
        }
        res.status(200).json({
            message:"trending media fetched",
            homeList:homeList,
            stauts:"success"
        })

    }catch(err){
        res.status(500).json({
            message:"internal server error",
            error:err.message
        })
    }
}
const getUpcoming= async function (req,res){
    try{
        let homeList;
        if(process.env.NODE_ENV === "development"){
            
            homeList = require("../seedFiles/home/upcoming.json")
        }else{
            homeList= await getMediaList(TMDB_ENDPOINT.fetchUpcoming);
        }
        res.status(200).json({
            message:"upcoming media fetched",
            homeList:homeList,
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
    getNowPlaying,getTopRated,getTrending,getUpcoming,getPopular
}