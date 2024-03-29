import * as request from "~/utils/request";

export const register = async (userData) => {
  try {
    const res = await request.post("user/create", userData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (username = "", password = "", type = "") => {
  try {
    const res = await request.get("user/login", {
      params: {
        username,
        password,
        type,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (userId) => {
  try {
    const res = await request.get("user/login/info", {
      params: {
        id: userId,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changeUserInfo = async (data) => {
  try {
    const res = await request.put("user/info", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addBookmark = async (data = {}) => {
  try {
    const res = await request.post(`user/bookmark`, data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBookmark = async (user) => {
  try {
    const res = await request.get("user/bookmark", {
      params: {
        user,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllBookmark = async (
  bookmarks = null,
  tags = null,
  page = 1,
  limit = 10,
  sort = "createdAt"
) => {
  try {
    const res = await request.get("questions/bookmarks", {
      params: {
        ...(bookmarks ? { bookmarks } : {}),
        ...(tags ? { tags } : {}),
        page,
        limit,
        sort,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const profile = async (id) => {
  try {
    const res = await request.get("user/profile", {
      params: {
        id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changeAvatar = async (data) => {
  try {
    const res = await request.post("user/avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (data) => {
  try {
    const res = await request.put("user/change-password", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (username = "", limit = 15, page = 1) => {
  try {
    const res = await request.get("user/all", {
      params: {
        username,
        limit,
        page,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
