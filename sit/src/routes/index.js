//Layouts
import { NoSidebar } from "~/components/layouts";

//Pages
import Home from "~/pages/Home";
import Questions from "~/pages/Questions";
import Ask from "~/pages/Ask";
import Tags from "~/pages/Tags";
import Works from "~/pages/Works";
import Users from "~/pages/Users";

//Public Routes
const publicRoutes = [
  { path: "/", component: Home },
  { path: "/questions", component: Questions },
  { path: "/tags", component: Tags },
  { path: "/users", component: Users },
];

//Private Routes
const privateRoutes = [
  { path: "/works", component: Works },
  { path: "/questions/ask", component: Ask, layout: NoSidebar },
];

export { publicRoutes, privateRoutes };
