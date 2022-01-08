import React, {FC} from 'react';
import { Route, Routes } from "react-router";
import { Alert } from 'react-bootstrap';

import HomePage from '../pages/home';
import SignInPage from '../pages/signin';
import SignUpPage from '../pages/signup';

const AppRoutes:FC = () => {
  return(
    <>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/signin" element={<SignInPage />}/>
        <Route path="/signup" element={<SignUpPage />}/>
      </Routes>
      {/* <Alert variant="danger m-0 mt-5">
        <h5>
          v1.02
        </h5>
      </Alert> */}
    </>
  );
};

export default AppRoutes;