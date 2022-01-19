import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
import { PrivateRoute, Avatar, NavBar } from "../components";
import { FirebaseContext } from "../context/firebase";
// import * as ROUTES from "../constants/routes";

const NotFoundPage: FC = (props) => {
  return (
    <>
      <NavBar />
      <Container className="mt-5">
        <Alert variant="danger">
          <h1 className="fs-5">Page not found</h1>
        </Alert>
      </Container>
    </>
  );
};

export default NotFoundPage;
