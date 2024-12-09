import { getAll } from "../controllers/handleFactory.js";

class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async addUser(user) {
    return await this.userModel.create(user);
  }

  getAll() {
    return getAll(this.userModel);
  }

  async getUserById(id) {
    return await this.userModel.findOne({ id });
  }

  async updateUserById(id, user) {
    return await this.userModel.update(id, user);
  }

  async deleteUserById(id) {
    return await this.userModel.delete(id);
  }
}
export default UserRepository;
