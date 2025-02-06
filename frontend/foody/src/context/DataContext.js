import { createContext, useReducer, useContext, useEffect } from "react";

// Tạo Context
const DataContext = createContext();

// Reducer quản lý state
const dataReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, loading: false, error: null };
    case "SET_ACCESS_TOKEN":
      return { ...state, accessToken: action.payload };
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      return { user: null, accessToken: null, loading: false, error: null };
    default:
      return state;
  }
};

// Provider để bao toàn bộ ứng dụng
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, {
    user: null,
    accessToken: localStorage.getItem("access_token") || null,
    loading: false,
    error: null,
  });

  // Hàm lấy thông tin user
  const fetchUser = async (token) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/me`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.status !== "fail" && data.status !== "error") {
        dispatch({ type: "SET_USER", payload: data.data.data });
      } else {
        throw new Error(data.message || "Lỗi không xác định");
      }
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
      console.error("Error fetching user:", error);
    }
  };

  // Gọi API khi có accessToken
  useEffect(() => {
    if (state.accessToken) {
      fetchUser(state.accessToken);
    }
  }, [state.accessToken]);

  // Hàm set accessToken
  const setAccessToken = (token) => {
    localStorage.setItem("access_token", token);
    dispatch({ type: "SET_ACCESS_TOKEN", payload: token });
  };

  // Hàm logout
  const logout = (token) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/user/logOut`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== "fail" && data.status !== "error") {
          localStorage.removeItem("access_token");
          dispatch({ type: "LOGOUT" });
          window.location.reload(); // Optional: Redirect to login page
        }
      })
      .catch((error) => {
        console.error("Error logout :", error);
      });
  };
  return (
    <DataContext.Provider value={{ state, setAccessToken, logout }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook để truy cập dữ liệu từ bất kỳ component nào
export const useData = () => useContext(DataContext);
