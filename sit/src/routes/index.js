import routesConfig from "~/config/router";

//Layouts
import { NoSidebar } from "~/layouts";

//Pages
import Questions from "~/pages/Questions";
import Question from "~/pages/Question";
import Ask from "~/pages/Ask";
import Tags from "~/pages/Tags";
import Works from "~/pages/Works";
import Users from "~/pages/Users";
import Profile from "~/pages/Profile";
import Auth from "~/pages/Auth";
import Bookmarks from "~/pages/Bookmarks";

//Public Routes
const publicRoutes = [
  { path: routesConfig.home, component: Questions },
  { path: routesConfig.question, component: Question },
  { path: routesConfig.tags, component: Tags },
  { path: routesConfig.users, component: Users },
  { path: routesConfig.profile, component: Profile },
  { path: routesConfig.bookmarks, component: Bookmarks },
  { path: routesConfig.register, component: Auth, layout: null },
  { path: routesConfig.login, component: Auth, layout: null },
  { path: routesConfig.ask, component: Ask, layout: NoSidebar },
  { path: routesConfig.works, component: Works },
];

export { publicRoutes };
