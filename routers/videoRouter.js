const express = require("express");
const VideoRouter = express.Router();
const {
    getVideoStream,
    getAllVideos,
    getThumbnail
} = require("../controllers/videoController");
/***********routes**************/

VideoRouter.get("/", getAllVideos);
VideoRouter.get("/watch", getVideoStream);
VideoRouter.get("/thumbnail", getThumbnail);

module.exports = VideoRouter;