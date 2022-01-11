import React, { FC } from "react";
import { Route, Routes } from "react-router";

import HomePage from "../pages/home";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";

const AppRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
