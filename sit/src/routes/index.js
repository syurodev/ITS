//Layouts
import { NoSidebar } from "~/layouts";

//Pages
import Questions from "~/pages/Questions";
import Question from "~/pages/Question";
import Ask from "~/pages/Ask";
import Tags from "~/pages/Tags";
import Works from "~/pages/Works";
import Users from "~/pages/Users";

// Host
const host = "";

//Public Routes
const publicRoutes = [
  { path: "/", component: Questions },
  { path: "/question", component: Question },
  { path: "/tags", component: Tags },
  { path: "/users", component: Users },
];

//Private Routes
const privateRoutes = [
  { path: "/works", component: Works },
  { path: "/questions/ask", component: Ask, layout: NoSidebar },
];

export { publicRoutes, privateRoutes };
