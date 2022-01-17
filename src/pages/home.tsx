import React, { FC, useContext } from "react";
import { Container } from "react-bootstrap";
import { Schedule, PrivateRoute, Users } from "../components";
import { usePageReloadInterval } from "../utils";
import { FirebaseContext } from "../context/firebase";

import "../styles/pages/home.sass";

const HomePage: FC = (props) => {
  console.clear();

  usePageReloadInterval(10);

  const { user, initializing } = useContext(FirebaseContext);

  console.log("~~~~~~~~~~~~~~~~ useAuthState ~~~~~~~~~~~~~~~~");
  console.log(user);
  console.log(initializing);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  return (
    <PrivateRoute>
      <Container className="mt-5">
        <h1 className="text-white">Home</h1>
        <Schedule />
        <Users />
      </Container>
    </PrivateRoute>
  );
};

export default HomePage;
