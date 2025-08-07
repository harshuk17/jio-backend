const userModel = require("../model/userModel");
// const userModel = require("../model/userModel")
const getMediaList = require("../utility/utility")
const express = require("express")


const getCurrentUser = async function (req,res){
     try {
        // console.log("getCurrentUser is called");
        const userId = req.userId; // ✅ Correct way to access userId from middleware
        // console.log("userId", userId);

        const user = await userModel.findById(userId).lean(); // lean makes the query faster

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "failure",
            });
        }

        const { _id, name, email, createdAt, isPremium, wishlist } = user;

        res.status(200).json({
            user: {
                _id,
                name,
                email,
                createdAt,
                wishlist,
                isPremium,
            },
            status: 200, // ✅ Use numeric code, not string
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching user from DB",
            error: err.message,
            status: "failure",
        });
    }
}
const addToWishlist = async (req, res) => {
    try {
        const {userID} = req.body;
        const { id, poster_path, name,media_type } = req.body;
        const user = await userModel.findById(userID);
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.wishList.find(item => item.id === id)) {
            return res.status(400).json({
                message: "Item already in wishlist",
                status: "failure",
            });
        }
        // let postItem;
        // if(media_type=="tv"){
        //     postItem= (await getMediaList.get(getMediaList.TMDB_ENDPOINT.fetchTvShowDetails(id))).data;
        // }else{
        //     postItem=(await getMediaList.get(getMediaList.TMDB_ENDPOINT.fetchMovieDetails(id))).data;
        // }

        const wishlistItem = {
            poster_path: poster_path,
            name: name,
            id: id,
            media_type: media_type,
        };

        user.wishList.push(wishlistItem);
        await userModel.findOneAndUpdate( 
            { _id: userID},
            { $push: { wishlist: wishlistItem }},
            { new: true, upsert: true } // options to return the updated document and create if it doesn't exist
        );

        res.status(200).json({
            status: "success",
        });
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            message: error.message,
            status: "failure",
        });
    }
};
const getUserWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.status(200).json({
            data: user.wishList,
            status: "success",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: "failure",
        });
    }
};
module.exports={
    getCurrentUser,addToWishlist,getUserWishlist
}