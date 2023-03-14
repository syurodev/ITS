import * as request from "~/utils/request";

export const ask = async (data) => {
  try {
    const res = await request.post("questions/ask", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getQuestions = async () => {
  try {
    const res = await request.get("questions");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const questionDetail = async (id) => {
  try {
    const res = await request.get("questions/question", {
      params: {
        id,
      },
    });
    return res[0];
  } catch (error) {
    console.log(error);
  }
};

export const unvote = async (id, user) => {
  try {
    const res = await request.patch(`questions/unvote/${id}`, user);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const upvote = async (id, user) => {
  try {
    const res = await request.patch(`questions/upvote/${id}`, user);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const downvote = async (id, user) => {
  try {
    const res = await request.patch(`questions/downvote/${id}`, user);
    return res;
  } catch (error) {
    console.log(error);
  }
};
