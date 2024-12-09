class AlbumRepository {
  constructor(albumModel) {
    this.albumModel = albumModel;
  }

  async addAlbum(user) {
    return await this.albumModel.create(user);
  }

  async getAllAlbums() {
    return await this.albumModel.findAll();
  }

  async getAlbumById(id) {
    return await this.albumModel.findOne({ id });
  }

  async updateAlbumById(id, user) {
    return await this.albumModel.update(id, user);
  }

  async deleteAlbumById(id) {
    return await this.albumModel.delete(id);
  }
}
export default AlbumRepository;
