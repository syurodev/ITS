import * as request from "~/utils/request";

export const getAnswerDataSortNew = async (id, limit = 10) => {
  try {
    const res = await request.get("answers/new/", {
      params: {
        id,
        limit,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAnswerDataSolved = async (id, limit = 10) => {
  try {
    const res = await request.get("answers/solved/", {
      params: {
        id,
        limit,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAnswerDataSortVote = async (id, limit = 10) => {
  try {
    const res = await request.get("answers/vote/", {
      params: {
        id,
        limit,
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

//SOLVED
export const solved = async (data) => {
  try {
    const res = await request.patch("answers/solved", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
