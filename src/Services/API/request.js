import axios from "axios";
import Cookies from "js-cookie";

const tokenManager = (() => {
  let accessToken = Cookies.get("authToken");
  let refreshToken = Cookies.get("refreshToken");

  return {
    getAccessToken: () => accessToken,
    getRefreshToken: () => refreshToken,
    setAccessToken: (newToken) => {
      accessToken = newToken;
      Cookies.set("authToken", newToken); // Lưu accessToken vào cookie
    },
    setRefreshToken: (newToken) => {
      refreshToken = newToken;
      Cookies.set("refreshToken", newToken); // Lưu refreshToken vào cookie
    },
  };
})();

let isRefreshing = false;
let failedQueue = [];

// Xử lý queue khi refresh token xong
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete request.defaults.headers.common["Authorization"];
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    const originalRequest = error.config;
    // Nếu gặp lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Nếu đang refresh thì chờ refresh token xong
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return request(originalRequest); // Gửi lại request ban đầu
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Đánh dấu request đã được retry
      originalRequest._retry = true;
      isRefreshing = true;

      // Gọi refresh token
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
            refreshToken: tokenManager.getRefreshToken(),
          })
          .then(({ data }) => {
            tokenManager.setAccessToken(data.accessToken); // Cập nhật accessToken mới
            tokenManager.setRefreshToken(data.refreshToken); // Cập nhật refreshToken nếu cần

            // Cập nhật headers Authorization với accessToken mới
            request.defaults.headers.common["Authorization"] = "Bearer " + data.accessToken;
            originalRequest.headers["Authorization"] = "Bearer " + data.accessToken;

            processQueue(null, data.accessToken); // Tiếp tục xử lý các request trong queue
            resolve(request(originalRequest)); // Gửi lại request ban đầu với token mới
          })
          .catch((err) => {
            processQueue(err, null); // Nếu refresh thất bại
            Cookies.remove("authToken");
            Cookies.remove("refreshToken");
            window.location.href = "/login"; // Chuyển hướng đến login nếu cần
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

export const setHeaderConfigAxios = (token) => {
  if (token) {
    request.defaults.headers.common["Authorization"] = token ? "Bearer " + token : "";
  } else {
    delete request.defaults.headers.common["Authorization"];
  }
};

export default request;
