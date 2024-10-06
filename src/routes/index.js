import config from "../config";
import { BoardLayout } from "../Layouts";
import { Board, Home, Login, SignUp } from "../Pages";
import { DashboardsRoutes } from "./dashboardsRoutes";
import { UserRoutes } from "./userRoutes";

// Page

// Khong can dang nhap
const publicRoutes = [
  { path: config.routes.root, component: Home },
  { path: config.routes.login, component: Login, layout: null },
  { path: config.routes.signup, component: SignUp, layout: null },
  { path: config.routes.board, component: Board, layout: BoardLayout },
  ...UserRoutes,
  ...DashboardsRoutes
];

// Can dang nhap
const privateRoutes = [];

export { publicRoutes, privateRoutes };
