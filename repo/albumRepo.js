class AlbumRepository {
  constructor(albumModel) {
    this.albumModel = albumModel;
  }

  addAlbum(user) {
    return this.albumModel.create(user);
  }

  getAllAlbums() {
    return this.albumModel.findAll();
  }

  getAlbumById(id) {
    return this.albumModel.findOne({ id });
  }

  updateAlbumById(id, user) {
    return this.albumModel.update(id, user);
  }

  deleteAlbumById(id) {
    return this.albumModel.delete(id);
  }
}
export default AlbumRepository;
