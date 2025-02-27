import customResourceResponse from "../utils/constant.js";

class AlbumService {
  constructor(albumRepo) {
    this.albumRepo = albumRepo;
  }

  countAlbums() {
    return this.albumRepo.countAlbums();
  }

  addAlbum() {
    return this.albumRepo.addAlbum();
  }

  getAllAlbums() {
    return this.albumRepo.getAllAlbums();
  }

  getAlbumById() {
    return this.albumRepo.getAlbumById();
  }

  updateAlbumById() {
    return this.albumRepo.updateAlbumById();
  }

  deleteAlbumById() {
    return this.albumRepo.deleteAlbumById();
  }

  getAlbumsByRestaurant() {
    return this.albumRepo.getAlbumsByRestaurant();
  }
}

export default AlbumService;
