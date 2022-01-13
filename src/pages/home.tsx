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

import "../styles/pages/home.sass";

const HomePage: FC = (props) => {
  console.clear();

  const { user, initializing } = useAuthState(auth);

  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(usersCollectionRef);
  const users = useFirestoreQuery(usersQuery);

  console.log("~~~~~~~~~~~~~~~~ useFirestoreQuery ~~~~~~~~~~~~~~~~");
  console.log(user);
  console.log(initializing);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <NavBar />
      {user ? (
        <Container className="mt-5">
          <h1 className="text-white">
            Home{" "}
            <span className="text-muted fs-3">(logged in as {user.email})</span>
          </h1>
          <Schedule />
          <Alert variant="dark box mt-5">
            <h2 className="text-white">Users</h2>
            <Container className="d-grid gap-3 mt-5">
              {users?.map((item: any, index: number) => (
                <Button
                  disabled={true}
                  variant="secondary"
                  href="#"
                  key={item.id}
                  className="lesson-btn"
                >
                  <Row>
                    <Col xs={1} className="user-number">
                      <h4>{index + 1}.</h4>
                    </Col>
                    <Col xs={1} className="user-number">
                      <Avatar email={item.id} height={28} size={50} />
                    </Col>
                    <Col xs={10} className="user-email">
                      <h4>{item.id}</h4>
                    </Col>
                  </Row>
                </Button>
              ))}
            </Container>
          </Alert>
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

export default HomePage;
