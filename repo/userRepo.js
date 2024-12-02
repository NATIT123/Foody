class UserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  addUser(user) {
    return this.userModel.create(user);
  }

  getAllUsers() {
    return this.userModel.findAll();
  }

  getUserById(id) {
    return this.userModel.findOne({});
  }

  updateUserById(id, user) {
    return this.userModel.update(id, user);
  }

  deleteUserById(id) {
    return this.userModel.delete(id);
  }
}
export default UserRepository;
