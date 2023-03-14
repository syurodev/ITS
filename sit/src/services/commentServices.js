import * as request from "~/utils/request";

export const getComments = async (id) => {
  try {
    const res = await request.get("comment/", {
      params: {
        id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addCommentQuestion = async (commentData) => {
  try {
    const res = await request.post("comment/question", commentData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addCommentAnswer = async (commentData) => {
  try {
    const res = await request.post("comment/answer", commentData);
    return res;
  } catch (error) {
    console.log(error);
  }
};
