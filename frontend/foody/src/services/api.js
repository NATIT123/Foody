import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
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

export const callFetchListUser = (query) => {
  // current=1&pageSize=3
  return axios.get(`/api/v1/user?${query}`);
};

export const callCreateAUser = (fullName, password, email, phone) => {
  return axios.post("/api/v1/user", { fullName, password, email, phone });
};

export const callBulkCreateUser = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};

export const callUpdateUser = (_id, fullName, phone) => {
  return axios.put("/api/v1/user", { _id, fullName, phone });
};

export const callDeleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
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
