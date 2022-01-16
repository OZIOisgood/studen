import React, { FC } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import * as ROUTES from "../constants/routes";

// import StarterPage from "../pages/starter";
// import HomePage from "../pages/home";
// import SignInPage from "../pages/signin";
// import SignUpPage from "../pages/signup";

// import { useAuthState } from "../hooks";
// import { auth } from "../firebase-config";

import { publicRoutes, privateRoutes } from "./routes";

const AppRoutes = () => {
  const user = true;

  return user ? (
    <Switch>
      {privateRoutes.map(({ path, Component }) => (
        <Route key={path} path={path}>
          {Component}
        </Route>
      ))}
      <Redirect to={ROUTES.SIGN_IN} />
    </Switch>
  ) : (
    <Switch>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path}>
          {Component}
        </Route>
      ))}
      <Redirect to={ROUTES.HOME} />
    </Switch>
  );
};

// const AppRoutes = () => (
//   <>
//     <Switch>
//       <Route path={ROUTES.STARTER}>
//         <StarterPage />
//       </Route>
//       <Route path={ROUTES.HOME}>
//         <HomePage />
//       </Route>
//       <Route path={ROUTES.SIGN_IN}>
//         <SignInPage />
//       </Route>
//       <Route path={ROUTES.SIGN_UP}>
//         <SignUpPage />
//       </Route>
//       <Redirect to={ROUTES.SIGN_IN} />
//     </Switch>
//   </>
// );

export default AppRoutes;
