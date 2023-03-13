import * as request from "~/utils/request";

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
