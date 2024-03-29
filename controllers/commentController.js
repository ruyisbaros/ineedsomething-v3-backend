const Comment = require("../models/CommentModel");
const CommentImage = require("../models/commentImagesModel");
const { uploadToCloudinary } = require("../helpers/imageService");
const mongoose = require("mongoose");

const commentCtrl = {
  addComment: async (req, res) => {
    const { comment, pic, path, commentPost, reply, tag } = req.body;
    let img;
    try {
      if (pic) {
        img = await uploadToCloudinary(pic, path);
        await CommentImage.create({
          post: commentPost,
          owner: req.user._id,
          url: img.url,
          public_id: img.public_id.split("commentImages/")[1],
          type: "comment",
        });
      }
      const newComment = await Comment.create({
        comment,
        reply,
        image: img?.url,
        commentBy: req.user._id,
        commentPost,
        tag,
      });
      const commentTurn = await Comment.findById(newComment._id).populate(
        "commentBy",
        "first_name last_name email picture username"
      );
      res.status(200).json({ comment: commentTurn, message: "ok" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getComments: async (req, res) => {
    try {
      const comments = await Comment.find()
        .populate("commentBy", "first_name last_name email picture username")
        //.populate("likes", "first_name last_name email picture username")
        .sort({ createdAt: -1 });
      res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getPostComments: async (req, res) => {
    try {
      const { commentPost } = req.params;
      const comments = await Comment.find({ commentPost });
      res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  likeUnlikeComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);
      if (comment.likes.includes(mongoose.Types.ObjectId(req.user._id))) {
        await Comment.findByIdAndUpdate(commentId, {
          $pull: { likes: mongoose.Types.ObjectId(req.user._id) },
        });
      } else {
        await Comment.findByIdAndUpdate(commentId, {
          $push: { likes: mongoose.Types.ObjectId(req.user._id) },
        });
      }
      res.status(200).json({ message: "Ok" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteAComment: async (req, res) => {
    try {
      const { id } = req.params;
      await Comment.findByIdAndDelete(id);
      res.status(200).json({ message: "Ok" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = commentCtrl;
