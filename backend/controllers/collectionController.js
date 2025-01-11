import CollectionRepo from "../repo/collectionRepo.js";
import CollectionService from "../services/collectionService.js";

import CollectionModel from "../models/collectionModel.js";

const collectionRepo = new CollectionRepo(CollectionModel);
const collectionService = new CollectionService(collectionRepo);

export const addcollection = collectionService.addCollection();

export const getAllcollections = collectionService.getAllCollections();

export const getcollectionById = collectionService.getCollectionById();

export const updatecollectionById = collectionService.updateCollectionById();

export const deletecollectionById = collectionService.deleteCollectionById();
