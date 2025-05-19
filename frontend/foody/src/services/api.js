import axios from "../utils/axios-customize";

export const callRegister = (payload) => {
  return axios.post("user/register", payload);
};

export const callLogin = (email, password) => {
  return axios.post("/user/login", { email, password });
};

export const callFetchAccount = () => {
  return axios.get("/user/me");
};

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

export const callCreateAUser = (fullName, password, email, phone) => {
  return axios.post("/api/v1/user", { fullName, password, email, phone });
};

export const callBulkCreateUser = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};

///////////////////////

export const callFetchListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

export const callFetchCategory = () => {
  return axios.get("/api/v1/database/category");
};

export const callCreateBook = (
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.post("/api/v1/book", {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};

export const callUpdateBook = (
  id,
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.put(`/api/v1/book/${id}`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};

export const callUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

export const callDeleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

export const callFetchBookById = (id) => {
  return axios.get(`api/v1/book/${id}`);
};

export const callPlaceOrder = (data) => {
  return axios.post("/api/v1/order", {
    ...data,
  });
};

export const callOrderHistory = () => {
  return axios.get("/api/v1/history");
};

export const callUpdateAvatar = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("image", fileImg);
  return axios({
    method: "post",
    url: "/user/uploadPhoto",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

export const callUpdateUserInfo = (phone, name, avatar) => {
  return axios.patch(`/user/updateMe`, {
    phone,
    fullname: name,
    photo: avatar,
  });
};

export const callUpdatePassword = (oldpass, newpass, confirmPassword) => {
  return axios.patch(`/user/updatePassword`, {
    oldpass,
    newpass,
    confirmPassword,
  });
};

export const callFetchDashboard = () => {
  return axios.get("/api/v1/database/dashboard");
};

export const callFetchListOrder = (query) => {
  return axios.get(`/api/v1/order?${query}`);
};

export const callFetchNotification = (id) => {
  return axios.get(`/notification/getNotificationsByUserId/${id}`);
};

export const callMarkAllNotificationAsRead = (id) => {
  return axios.get(`/notification/makeAll/${id}`);
};

export const callFetchListRestaurant = (currentPage, payload) => {
  return axios.post(
    `/restaurant/getAllRestaurants?page=${currentPage}`,
    payload
  );
};

export const callFetchListUser = (currentPage, payload) => {
  return axios.get(`/user/getAllUsers?page=${currentPage}`, payload);
};

export const callFetchFavoriteRestaurantByUserId = (
  userId,
  currentPage,
  payload
) => {
  return axios.post(
    `/favorite/getFavoriteRestaurantByUserId/${userId}?page=${currentPage}`,
    payload
  );
};

export const callFetchNearestRestaurant = (currentPage, payload) => {
  return axios.post(
    `/restaurant/getNearestRestaurants?page=${currentPage}`,
    payload
  );
};

export const callFetchRestaurantsByRate = (currentPage, payload) => {
  return axios.post(
    `/restaurant/fetchRestaurantsByRate?page=${currentPage}`,
    payload
  );
};

export const callFetchTopDeals = (currentPage, payload) => {
  return axios.post(
    `/restaurant/getRestaurantTopDeals?page=${currentPage}`,
    payload
  );
};

export const callfetchMostViewed = (currentPage, payload) => {
  return axios.post(
    `/restaurant/getRestaurantByViews?page=${currentPage}`,
    payload
  );
};

export const callfetchFavoriteRestaurantsEat = (
  userId,
  currentPage,
  payload
) => {
  return axios.post(
    `/favorite/getFavoriteRestaurantByUserId/${userId}?page=${currentPage}`,
    payload
  );
};

export const callAddNotification = (notification) => {
  return axios.post(`/notification/addNotification`, notification);
};

export const callAddComment = (userId, restaurantId, commentData) => {
  return axios.post(
    `/comment/addComment/user/${userId}/restaurant/${restaurantId}`,
    commentData
  );
};

export const callFetchListComment = () => {
  return axios.get("/comment/getAllComment");
};

export const callLikeComment = (commentId, userId) => {
  return axios.get(`/comment/like/${commentId}/${userId}`);
};

export const callReplyComment = (commentId, payload) => {
  return axios.post(`/comment/reply/${commentId}`, payload);
};

export const callAddAlbum = (payload) => {
  return axios.post("/album/addAlbum", payload);
};

export const callAddFavoriteRestaurant = (payload) => {
  return axios.post("/favorite/addFavoriteRestaurant", payload);
};
export const callSavedRestaurant = (userId) => {
  return axios.get(`/favorite/getSavedRestaurantByUserId/${userId}`);
};

export const callFetchRestaunrantsPending = (currentPage) => {
  return axios.get(`/restaurant/getRestaunrantsPending?page=${currentPage}`);
};

export const callFindRestaurantsPendingByFields = (
  currentPage,
  searchQuery
) => {
  return axios.get(
    `/restaurant/findRestaurantsPendingByFields?page=${currentPage}&searchQuery=${searchQuery}`
  );
};

export const callUpdateStatus = (restaurantId, status) => {
  return axios.patch(`/restaurant/updateStatus/${restaurantId}`, status);
};

export const callAddFood = (payload) => {
  return axios.post(`/food/addFood`, payload);
};

export const callUpdateFood = (foodId, payload) => {
  return axios.patch(`/food/${foodId}`, payload);
};

export const callDeleteFood = (foodId) => {
  return axios.delete(`/food/${foodId}`);
};

export const callFetchFoodsByRestaurant = (id) => {
  return axios.get(`/food/${id}`);
};

export const callFetchSubCategories = () => {
  return axios.get("/subCategory/getSubCategoryByCategorySpecific");
};

export const callFetchOwners = () => {
  return axios.get("/user/findUsersByRole");
};

export const callCreateRestaurant = (payload) => {
  return axios.post("/restaurant", payload);
};

export const callUpdateRestaurant = (restaurantId, payload) => {
  return axios.post(`/restaurant/${restaurantId}`, payload);
};

export const callDeleteRestaurant = (restaurantId) => {
  return axios.delete(`/restaurant/${restaurantId}`);
};

export const callFetchOwnerRestaurants = (userId, currentPage) => {
  return axios.get(
    `/restaurant/getOwnerRestaurants/${userId}?page=${currentPage}`
  );
};

export const callFetchRestaurantsByFields = (currentPage, searchQuery) => {
  return axios.get(
    `/restaurant/findRestaurantsByFields?page=${currentPage}&searchQuery=${searchQuery}`
  );
};

export const callFetchDistrictsByCity = (cityId) => {
  return axios.get(`/district/getDistrictsByCity/${cityId}`);
};

export const callFetchRestaurantsOwnerByFields = (
  userId,
  currentPage,
  searchQuery
) => {
  return axios.get(
    `/restaurant/findRestaurantsOwnerByFields/${userId}?page=${currentPage}&searchQuery=${searchQuery}`
  );
};

export const callCreateUser = (payload) => {
  return axios.post("/user", payload);
};

export const callUpdateUser = (UserId, payload) => {
  return axios.post(`/user/${UserId}`, payload);
};

export const callDeleteUser = (UserId) => {
  return axios.delete(`/user/${UserId}`);
};

export const callFetchUserByFields = (currentPage, searchQuery) => {
  return axios.get(
    `/user/findUsersByFields?page=${currentPage}&searchQuery=${searchQuery}`
  );
};

export const callFetchUserCount = () => {
  return axios.get("/user/count");
};

export const callFetchAlbumCount = () => {
  return axios.get("/album/count");
};

export const callFetchRestaurantCount = () => {
  return axios.get("/restaurant/count");
};
export const callFetchCommentCount = () => {
  return axios.get("/comment/count");
};

export const callCheckPasswordToken = (resetToken) => {
  return axios.post(`/user/checkPassword/${resetToken}`);
};

export const callResetPassword = (resetToken, data) => {
  return axios.patch(`/user/resetPassword/${resetToken}`, data);
};

export const callGetRecommendedRestaurants = (params) => {
  return axios.get("http://127.0.0.1:8005/recommendations", { params });
};

export const callFetchUserDetails = (userId) => {
  return axios.get(
    `${process.env.REACT_APP_BASE_URL}/user/getUserDetails/${userId}`,
    {}
  );
};

export const callFetchAllUserDetails = () => {
  return axios.get(`user/getAllDetails`);
};

export const callFetchRestaurantById = (id) =>
  axios.get(`/restaurant/getRestaurant/${id}`);

export const callFetchCommentsByRestaurant = (id) =>
  axios.get(`/comment/getCommentsByRestaurant/${id}`);

export const callFetchAlbumsByRestaurant = (id) =>
  axios.get(`/album/getAlbumsByRestaurant/${id}`);

export const callFoodsByRestaurant = (id) => {
  return axios.get(`/food/getFoodsByRestaurant/${id}`);
};

export const callRestaurantsByFields = (payload, searchQuery) => {
  return axios.post(
    `/restaurant/getRestaurantByFields?searchQuery=${searchQuery}`,
    payload
  );
};
