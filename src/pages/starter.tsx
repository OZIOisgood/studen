import React, { FC } from "react";
import { Container } from "react-bootstrap";

import NavBar from "../components/Navbar";

const StarterPage: FC = (props) => {
  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <h1 className="text-white">Starter page</h1>
      </Container>
    </>
  );
};

export default StarterPage;
