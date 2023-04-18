import * as request from "~/utils/request";
// import socket from "./socket";

//ASK
export const ask = async (data) => {
  try {
    const res = await request.post("questions/ask", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//EDIT QUESTION
export const editQuestion = async (data) => {
  try {
    const res = await request.put("questions/edit", data);
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
export const getQuestions = async (
  limit = 10,
  sort = "createdAt",
  tag = null,
  user = null,
  page = 1
) => {
  try {
    const res = await request.get("questions", {
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

//GET QUESTION DETAIL
// export const questionDetail = async (id) => {
//   try {
//     const res = await request.get("questions/question", {
//       params: {
//         id,
//       },

//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     });
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const questionDetail = async (id) => {
  try {
    const res = await request.get("questions/question", {
      params: {
        id,
      },
      withCredentials: true, // send cookies with request
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Extract and set cookies
    // const cookies = res.headers["set-cookie"];
    // if (cookies) {
    //   cookies.forEach((cookie) => {
    //     document.cookie = cookie;
    //   });
    // }

    return res;
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
export const getTags = async (limit = 0, tag, page = 1) => {
  try {
    const res = await request.get("questions/tags", {
      params: {
        ...(tag ? { tag } : {}),
        limit,
        page,
      },
    });
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
