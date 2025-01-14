class CollectionService {
  constructor(collectionRepo) {
    this.collectionRepo = CollectionRepo;
  }

  addCollection() {
    return this.collectionRepo.addCollection();
  }

  getAll() {
    return this.collectionRepo.getAll();
  }

  getCollectionById() {
    return this.collectionRepo.getCollectionById();
  }

  updateCollectionById() {
    return this.collectionRepo.updateCollectionById();
  }

  deleteCollectionById() {
    return this.collectionRepo.deleteCollectionById();
  }
}

export default CollectionService;
