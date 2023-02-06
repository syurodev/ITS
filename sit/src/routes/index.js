import Home from "~/pages/Home";
import Questions from "~/pages/Questions";

//Public Routes
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/questions", component: Questions },
];

//Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
