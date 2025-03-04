import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Tạo Context
const DataContext = createContext();

// Reducer quản lý state
const dataReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false, error: null };
    case "SET_CITIES":
      return { ...state, cities: action.payload, loading: false };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload, loading: false };
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload, loading: false };
    case "SET_CUISINES":
      return { ...state, cuisines: action.payload, loading: false };
    case "SET_DISTRICTS":
      return { ...state, districts: action.payload, loading: false };
    case "SET_SUB_CATEGORIES":
      return { ...state, subCategories: action.payload, loading: false };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "SET_SELECTED_CITY":
      return { ...state, selectedCity: action.payload };
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_ACCESS_TOKEN":
      return { ...state, accessToken: action.payload };
    case "LOADING":
      return { ...state, loading: true };
    case "ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      return {
        user: null,
        accessToken: null,
        cities: [],
        categories: [],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

// Provider để bao toàn bộ ứng dụng
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, {
    user: null,
    accessToken: localStorage.getItem("access_token") || null,
    cities: JSON.parse(localStorage.getItem("cities")) || [],
    cuisines: JSON.parse(localStorage.getItem("cuisines")) || [],
    categories: JSON.parse(localStorage.getItem("categories")) || [],
    selectedCity: JSON.parse(localStorage.getItem("city")) || null,
    selectedCategory: JSON.parse(localStorage.getItem("category")) || null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (state.user) {
      dispatch({ type: "LOADING" });

      fetchWithAuth(
        `${process.env.REACT_APP_BASE_URL}/notification/getNotificationsByUserId/${state.user._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== "fail" && data.status !== "error") {
            dispatch({ type: "SET_NOTIFICATIONS", payload: data.data.data });
          }
        })
        .catch((error) =>
          console.error("Error fetching notifications:", error)
        );
    }
  }, [state.user]);

  const addNotification = useCallback(
    (message) => {
      if (!state.user) return;

      const notification = { description: message, userId: state.user._id };

      fetch(`${process.env.REACT_APP_BASE_URL}/notification/addNotification`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${state.accessToken}`,
        },
        body: JSON.stringify(notification),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.status !== "error" && data?.status !== "fail") {
            console.log(state.notifications);
            const newData = {
              active: false,
              _id: data.data.data._id,
              description: message,
              isRead: false,
              userId: state.user._id,
              createdAt: data.data.createdAt,
            };
            dispatch({ type: "ADD_NOTIFICATION", payload: newData });
          }
        })
        .catch((error) => {
          dispatch({ type: "ERROR", payload: error.message });
          console.error("Error adding notification:", error);
        });
    },
    [state.user, state.accessToken]
  );

  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Refresh token failed");

      const data = await response.json();
      if (!data.accessToken) throw new Error("No new access token received");

      localStorage.setItem("access_token", data.accessToken);
      dispatch({ type: "SET_ACCESS_TOKEN", payload: data.accessToken });

      return data.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
      return null;
    }
  };

  const unreadExists = useMemo(() => {
    if (state.notifications) {
      return state.notifications.some((n) => !n.isRead);
    }
  }, [state.notifications]);

  const markAllNotificationsRead = async () => {
    if (!state.user) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/notification/makeAll/${state.user._id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${state.accessToken}` },
        }
      );
      const data = await response.json();

      if (
        data?.status !== "fail" &&
        data?.status !== "error" &&
        data?.status !== 400
      ) {
        dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
      }
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
    }
  };

  // Fetch User khi có accessToken
  useEffect(() => {
    if (state.accessToken) {
      fetchWithAuth(`${process.env.REACT_APP_BASE_URL}/user/me`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== "fail" && data.status !== "error") {
            dispatch({ type: "SET_USER", payload: data.data.data });
          } else {
            throw new Error(data.message || "Unknown error");
          }
        })
        .catch((error) => {
          dispatch({ type: "ERROR", payload: error.message });
          console.error("Error fetching user:", error);
        });
    }
  }, [state.accessToken]);
  // Hàm gọi API chung để giảm trùng lặp
  const fetchData = useCallback(async (url, type, cacheKey = null) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      if (data.status !== "fail" && data.status !== "error") {
        dispatch({ type, payload: data.data.data });
        if (cacheKey)
          localStorage.setItem(cacheKey, JSON.stringify(data.data.data)); // Lưu cache
        if (cacheKey === "cities")
          dispatch({ type: "SET_SELECTED_CITY", payload: data.data.data[0] });
        if (cacheKey === "categories")
          dispatch({
            type: "SET_SELECTED_CATEGORY",
            payload: data.data.data[0],
          });
      } else {
        throw new Error(data.message || "Lỗi không xác định");
      }
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
      console.error(`Error fetching ${type.toLowerCase()}:`, error);
    }
  }, []);

  // Fetch Cities và Categories khi ứng dụng tải lần đầu (nếu không có cache)
  useEffect(() => {
    if (!state?.cities?.length) {
      fetchData(
        `${process.env.REACT_APP_BASE_URL}/city/getAllCity`,
        "SET_CITIES",
        "cities"
      );
    }
    if (!state?.categories?.length)
      fetchData(
        `${process.env.REACT_APP_BASE_URL}/category/getAllCategory`,
        "SET_CATEGORIES",
        "categories"
      );

    if (!state?.cuisines?.length)
      fetchData(
        `${process.env.REACT_APP_BASE_URL}/cuisines/getAllCuisines`,
        "SET_CUISINES",
        "cuisines"
      );
  }, [fetchData, state.cities, state.categories, state?.cuisines?.length]);

  // Fetch Districts khi City thay đổi
  useEffect(() => {
    if (state.selectedCity) {
      fetchData(
        `${process.env.REACT_APP_BASE_URL}/district/getDistrictsByCity/${state.selectedCity._id}`,
        "SET_DISTRICTS"
      );
    }
  }, [state.selectedCity, fetchData]);

  // Fetch SubCategories khi Category thay đổi
  useEffect(() => {
    if (state.selectedCategory) {
      fetchData(
        `${process.env.REACT_APP_BASE_URL}/subCategory/getSubCategoryByCategory/${state.selectedCategory._id}`,
        "SET_SUB_CATEGORIES"
      );
    }
  }, [state.selectedCategory, fetchData]);

  // Set Selected City & Category vào localStorage
  const setSelectedCity = (city) => {
    localStorage.setItem("city", JSON.stringify(city));
    dispatch({ type: "SET_SELECTED_CITY", payload: city });
  };

  const setSelectedCategory = (category) => {
    localStorage.setItem("category", JSON.stringify(category));
    dispatch({ type: "SET_SELECTED_CATEGORY", payload: category });
  };

  // Hàm set accessToken
  const setAccessToken = (token) => {
    localStorage.setItem("access_token", token);
    dispatch({ type: "SET_ACCESS_TOKEN", payload: token });
  };

  const fetchWithAuth = async (url, options = {}) => {
    let accessToken = state.accessToken;

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    options.credentials = "include";

    let response = await fetch(url, options);

    if (response.status === 401) {
      console.log("Access token expired, refreshing...");

      const newToken = await refreshToken();

      if (newToken) {
        options.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, options);
      }
    }

    return response;
  };

  // Hàm logout
  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/logOut`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${state.accessToken}` },
        }
      );
      const data = await response.json();
      if (
        data.status !== "fail" &&
        data.status !== "error" &&
        data.status !== 400
      ) {
        ["access_token"].forEach((key) => localStorage.removeItem(key));
        window.location.reload();
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        state,
        markAllNotificationsRead,
        unreadExists,
        addNotification,
        setAccessToken,
        setSelectedCity,
        setSelectedCategory,
        logout,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Hook để truy cập dữ liệu từ bất kỳ component nào
export const useData = () => useContext(DataContext);
