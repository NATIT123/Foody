import CommentRepo from "../repo/commentRepo.js";
import CommentService from "../services/commentService.js";
import CommentModel from "../models/commentModel.js";

const commentRepo = new CommentRepo(CommentModel);
const commentService = new CommentService(commentRepo);

export const countComments = commentService.countComments();

export const addComment = commentService.addComment();

export const getAllComments = commentService.getAllComments();

export const getCommentById = commentService.getCommentById();

export const updateCommentById = commentService.updateCommentById();

export const deleteCommentById = commentService.deleteCommentById();

export const getCommentsByRestaurant = commentService.getCommentsByRestaurant();

export const handleLike = commentService.handleLike();

export const replyComment = commentService.replyComment();
