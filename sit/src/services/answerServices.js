import * as request from "~/utils/request";

export const getAnswerData = async (id) => {
  try {
    const res = await request.get("answers/item/", {
      params: {
        id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addAnswer = async (answerData) => {
  try {
    const res = await request.post("answers", answerData);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const unvote = async (id, user) => {
  try {
    const res = await request.patch(`answers/unvote/${id}`, user);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const upvote = async (id, user) => {
  try {
    const res = await request.patch(`answers/upvote/${id}`, user);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const downvote = async (id, user) => {
  try {
    const res = await request.patch(`answers/downvote/${id}`, user);
    return res;
  } catch (error) {
    console.log(error);
  }
};
