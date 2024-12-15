import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";
class AlbumRepository {
  constructor(albumModel) {
    this.albumModel = albumModel;
  }

  addAlbum() {
    return createOne(this.albumModel);
  }

  getAllAlbums() {
    return getAll(this.albumModel);
  }

  getAlbumById() {
    return getOne(this.albumModel);
  }

  updateAlbumById() {
    return updateOne(this.albumModel);
  }

  deleteAlbumById() {
    return deleteOne(this.albumModel);
  }
}
export default AlbumRepository;
