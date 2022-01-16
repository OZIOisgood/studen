import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Container,
  Alert,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import { collection, query, orderBy, where } from "firebase/firestore";
import { auth, firestore } from "../firebase-config";
import { useFirestoreQuery, useAuthState } from "../hooks";
import { Avatar, Schedule } from "../components";
import * as ROUTES from "../constants/routes"; //TODO: use constants instead all link

import NavBar from "../components/Navbar";

const GroupsPage: FC = (props) => {
  const { user } = useAuthState(auth);

  return (
    <>
      <NavBar />
      {user ? (
        <Container className="mt-5">
          <h1 className="text-white">Groups</h1>
        </Container>
      ) : (
        <Container className="d-grid gap-3 mt-5">
          <Alert variant="danger">
            Please sign in or sign up to use STUDEN.
          </Alert>
        </Container>
      )}
    </>
  );
};

export default GroupsPage;
