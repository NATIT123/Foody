import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class CollectionRepository {
  constructor(collectionModel) {
    this.collectionModel = collectionModel;
  }

  addCollection() {
    return createOne(this.collectionModel);
  }

  getAll() {
    return getAll(this.collectionModel);
  }

  getCollectionById() {
    return getOne(this.collectionModel);
  }

  updateCollectionById() {
    return updateOne(this.collectionModel);
  }

  deleteCollectionById() {
    return deleteOne(this.collectionModel);
  }
}
export default CollectionRepository;
