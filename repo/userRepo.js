import {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  createOne,
} from "../controllers/handleFactory.js";

class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  addUser() {
    return createOne(this.userModel);
  }

  getAll() {
    return getAll(this.userModel);
  }

  getUserById() {
    return getOne(this.userModel);
  }

  updateUserById() {
    return updateOne(this.userModel);
  }

  deleteUserById() {
    return deleteOne(this.userModel);
  }
  getMe() {
    return (req, res, next) => {
      req.params.id = req.user.id;
      next();
    };
  }
}
export default UserRepository;
