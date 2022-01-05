import React, {FC} from 'react';
import { Route, Routes } from "react-router";

import HomePage from '../pages/home';

const AppRoutes:FC = () => {
  return(
    <Routes>
      <Route path="/" element={<HomePage />}/>
    </Routes>
  );
};

export default AppRoutes;