//Layouts
import { NoSidebar } from "~/components/layouts";

//Pages
import Home from "~/pages/Home";
import Questions from "~/pages/Questions";
import Ask from "~/pages/Ask";

//Public Routes
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/questions", component: Questions },
  { path: "/questions/ask", component: Ask, layout: NoSidebar },
];

//Private Routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
