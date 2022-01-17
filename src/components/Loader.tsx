import React, { FC } from "react";
import { Container, Spinner } from "react-bootstrap";

import "../styles/components/loader.sass";

export const Loader: FC = () => {
  return (
    <Container id="main-container" className="d-grid h-100">
      <Spinner animation="border" variant="info" />
    </Container>
  );
};
