import React, { FC, useContext } from "react";
import { Container, Alert } from "react-bootstrap";
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
        // <Container className="d-grid gap-3 mt-5">
        //   <Alert variant="danger">
        //     Please sign in or sign up to use STUDEN.
        //   </Alert>
        // </Container>
        <Navigate to={ROUTES.SIGN_IN} />
      )}
    </>
  );
};
