import AlbumRepo from "../repo/albumRepo.js";
import AlbumService from "../services/albumService.js";

import AlbumModel from "../models/AlbumModel.js";

const albumRepo = new AlbumRepo(AlbumModel);
const albumService = new AlbumService(albumRepo);

export const addAlbum = async (req, res, next) => {
  try {
    const response = await albumService.addAlbum(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getAllAlbums = async (req, res, next) => {
  try {
    const response = await albumService.getAllAlbums(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const response = await albumService.getAlbumById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const updateAlbumById = async (req, res, next) => {
  try {
    const response = await albumService.updateAlbumById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};

export const deleteAlbumById = async (req, res, next) => {
  try {
    const response = await albumService.deleteAlbumById(req);
    res.statusCode = response.statusCode;
    return res.json({ message: response.message, data: response.data });
  } catch (err) {
    next(err);
  }
};
