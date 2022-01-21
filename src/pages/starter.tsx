import { FC, useContext } from "react";
import { Container } from "react-bootstrap";
import { FirebaseContext } from "../context/firebase";

import { Loader, NavBar } from "../components";
import { Navigate } from "react-router";
import * as ROUTES from "../constants/routes";

const StarterPage: FC = (props) => {
  const { user, initializing } = useContext(FirebaseContext);

  return (
    <>
      <NavBar />
      {user ? (
        <Navigate to={ROUTES.HOME} />
      ) : initializing ? (
        <Loader />
      ) : (
        <Container className="mt-5">
          <h1 className="text-white">Starter page</h1>
        </Container>
      )}
    </>
  );
};

export default StarterPage;
