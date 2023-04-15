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
