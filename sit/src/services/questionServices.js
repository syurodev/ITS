import * as request from "~/utils/request";

//ASK
export const ask = async (data) => {
  try {
    const res = await request.post("questions/ask", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//DELETE QUESTION
export const deleteQuestion = async (id) => {
  try {
    const res = await request.destroy("questions/question/delete", {
      params: {
        id,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

//GET ALL QUESTIONS AND SORT
export const getQuestionsSortNew = async (
  limit = 10,
  sort = -1,
  tag = null,
  user = null
) => {
  try {
    const res = await request.get("questions/new", {
      params: {
        limit,
        sort,
        ...(tag ? { tag } : {}),
        ...(user ? { user } : {}),
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getQuestionsSortVote = async (
  limit = 10,
  sort = -1,
  tag = null,
  user = null
) => {
  try {
    const res = await request.get("questions/vote", {
      params: {
        limit,
        sort,
        ...(tag ? { tag } : {}),
        ...(user ? { user } : {}),
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

//GET QUESTION DETAIL
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

//VOTE
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

//TAGS
export const getTags = async () => {
  try {
    const res = await request.get("questions/tags");
    return res;
  } catch (error) {
    console.log(error);
  }
};

//SEARCH
export const search = async (value, limit = 5) => {
  // const regex = /#\w+/g;
  // const tags = value.match(regex).map((tag) => tag.substring(1));

  try {
    const res = await request.get("questions/search", {
      params: {
        value,
        limit,
        // tags,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
