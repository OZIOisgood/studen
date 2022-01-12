import React, { FC } from "react";
import { Route, Routes } from "react-router";
import * as ROUTES from "../constants/routes";

import HomePage from "../pages/home";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";

const AppRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
