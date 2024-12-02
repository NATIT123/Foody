import customResourceResponse from "../utils/constant.js";

class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async addUser(req) {
    const { fullName, email, address, phone, password, image } = req.body;

    const response = {};
    if (!fullName || !email) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const user = this.userRepo.addUser(
      fullName,
      email,
      address,
      phone,
      password,
      image
    );

    if (!user) {
      response.message = customResourceResponse.serverError.message;
      response.statusCode = customResourceResponse.serverError.statusCode;
      return response;
    }

    response.message = customResourceResponse.created.message;
    response.statusCode = customResourceResponse.created.statusCode;
    response.data = user._id;

    return response;
  }

  async getAllUsers() {
    const response = {};
    response.data = [];
    const users = await this.userRepo.getAllUsers();
    if (!users) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = users;
    return response;
  }

  async getUserById(req) {
    const response = {};
    response.data = {};
    const user = await this.userRepo.getUserById(id);
    if (!user) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    response.message = customResourceResponse.success.message;
    response.statusCode = customResourceResponse.success.statusCode;
    response.data = user;
    return response;
  }

  async updateUserById(req) {
    const { fullName, email, address, phone, password, image } = req.body;
    const { id } = req.params;
    const response = {};
    if (!fullName || !email) {
      response.message = customResourceResponse.validationError.message;
      response.statusCode = customResourceResponse.validationError.statusCode;
      return response;
    }

    const user = await this.userRepo.getUserById(id);
    if (!user) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      return response;
    }

    const updatedUser = await this.userRepo.updateUserById(id, user);
    if (!updatedUser) {
      response.message = customResourceResponse.recordNotFound.message;
      response.statusCode = customResourceResponse.recordNotFound.statusCode;
      response.data = updatedUser._id;
      return response;
    }
  }
}

export default UserService;
