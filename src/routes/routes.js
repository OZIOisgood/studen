import * as ROUTES from "../constants/routes";

import StarterPage from "../pages/starter";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";

import HomePage from "../pages/home";

export const publicRoutes = [
  {
    path: ROUTES.STARTER,
    Component: StarterPage,
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

export const privateRoutes = [
  {
    path: ROUTES.HOME,
    Component: HomePage,
  },
];
