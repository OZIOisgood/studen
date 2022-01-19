import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import StarterPage from "../pages/starter";
import HomePage from "../pages/home";
import GroupsPage from "../pages/groups";
import GroupPage from "../pages/group";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";
import NotFoundPage from "../pages/notFound";

const AppRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path={ROUTES.STARTER} element={<StarterPage />} />

        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
        <Route path={`${ROUTES.GROUPS}/:id`} element={<GroupPage />} />

        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
