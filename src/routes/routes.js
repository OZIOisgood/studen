import * as ROUTES from "../constants/routes";

import StarterPage from "../pages/starter";
import HomePage from "../pages/home";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";

export const publicRoutes = [
  {
    path: ROUTES.STARTER,
    Component: StarterPage,
  },
  {
    path: ROUTES.HOME,
    Component: HomePage,
  },
  {
    path: ROUTES.SIGN_IN,
    Component: SignInPage,
  },
  {
    path: ROUTES.SIGN_UP,
    Component: SignUpPage,
  },
];
