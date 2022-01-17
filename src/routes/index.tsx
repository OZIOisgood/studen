import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import StarterPage from "../pages/starter";
import HomePage from "../pages/home";
import GroupsPage from "../pages/groups";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";

const AppRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path={ROUTES.STARTER} element={<StarterPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
