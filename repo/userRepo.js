class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  addUser(user) {
    return this.userModel.create(user);
  }

  async getAll() {
    return await this.userModel.find();
  }

  getUserById(id) {
    return this.userModel.findOne({ id });
  }

  updateUserById(id, user) {
    return this.userModel.update(id, user);
  }

  deleteUserById(id) {
    return this.userModel.delete(id);
  }
}
export default UserRepository;
