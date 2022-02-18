import React, { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import { NavBar, Loader } from "../components";
import * as ROUTES from "../constants/routes";
import { FirebaseContext } from "../context/firebase";

type PrivateRouteProps = {
  children: React.ReactNode;
};

export const PrivateRoute: FC<PrivateRouteProps> = (props) => {
  const { user, initializing } = useContext(FirebaseContext);

  return (
    <>
      <NavBar />
      {user ? (
        props.children
      ) : initializing ? (
        <Loader />
      ) : (
        <Navigate to={ROUTES.SIGN_IN} />
      )}
    </>
  );
};
