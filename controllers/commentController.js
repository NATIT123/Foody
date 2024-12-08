import CommentRepo from "../repo/commentRepo.js";
import CommentService from "../services/commentService.js";

import CommentModel from "../models/CommentModel.js";

const commentRepo = new CommentRepo(CommentModel);
const commentService = new CommentService(commentRepo);

export const addComment = async (req, res, next) => {
  try {
    const response = await commentService.addComment(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const response = await commentService.getAllComments(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const response = await commentService.getCommentById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const updateCommentById = async (req, res, next) => {
  try {
    const response = await commentService.updateCommentById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const deleteCommentById = async (req, res, next) => {
  try {
    const response = await commentService.deleteCommentById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};
