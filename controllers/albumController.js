import AlbumRepo from "../repo/albumRepo.js";
import AlbumService from "../services/albumService.js";

import AlbumModel from "../models/AlbumModel.js";

const albumRepo = new AlbumRepo(AlbumModel);
const albumService = new AlbumService(albumRepo);

export const addAlbum = albumService.addAlbum();

export const getAllAlbums = albumService.getAllAlbums();

export const getAlbumById = albumService.getAlbumById();

export const updateAlbumById = albumService.updateAlbumById();

export const deleteAlbumById = albumService.deleteAlbumById();
