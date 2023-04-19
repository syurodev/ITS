const routes = {
  home: "/",
  tagUser: "/:tag/:user",
  tag: "/:tag",
  userQuestions: "/questions/user/:user",
  question: "/question/:idQuestion",
  tags: "/tags",
  users: "/users",
  profile: "/profile/:userId",
  bookmarks: "/bookmarks",
  newwork: "/new-work",
  userWorks: "/works/user/:user",
  works: "/works",
  worksTag: "/works/:tag",
  ask: "/ask",
  register: "/auth/register",
  login: "/auth/login",
};

export default routes;
