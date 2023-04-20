import * as request from "~/utils/request";
// import socket from "./socket";

//Create
export const create = async (data) => {
  try {
    const res = await request.post("work/create", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

//Edit
export const editWork = async (data) => {
  try {
    const res = await request.put("work/edit", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//get all works
export const getWorks = async (
  limit = 10,
  sort = "createdAt",
  tag = null,
  user = null,
  page = 1
) => {
  try {
    const res = await request.get("work/works", {
      params: {
        limit,
        sort,
        ...(tag ? { tag } : {}),
        ...(user ? { user } : {}),
        page,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

//delete work
export const deleteWork = async (id) => {
  try {
    const res = await request.destroy("work/delete", {
      params: {
        id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
