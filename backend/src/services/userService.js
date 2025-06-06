class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  countUsers() {
    return this.userRepo.countUsers();
  }

  addUser() {
    return this.userRepo.addUser();
  }

  getAllUsers() {
    return this.userRepo.getAll();
  }

  getUserById() {
    return this.userRepo.getUserById();
  }

  updateUserById() {
    return this.userRepo.updateUserById();
  }

  deleteUserById() {
    return this.userRepo.deleteUserById();
  }

  getMe() {
    return this.userRepo.getMe();
  }
  uploadPhoto() {
    return this.userRepo.uploadPhoto();
  }
  getUsersDetail() {
    return this.userRepo.getUserDetails();
  }
  getAllDetails() {
    return this.userRepo.getAllDetails();
  }
  findUsersByFields() {
    return this.userRepo.findUsersByFields();
  }

  getChatBotResponse() {
    return this.userRepo.getChatBotResponse();
  }
  findUsersByRole() {
    return this.userRepo.findUsersByRole();
  }
}

export default UserService;
