import React, { FC } from "react";
import {
  Button,
  Container,
  Alert,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import { collection, query, orderBy } from "firebase/firestore";
import { auth, firestore } from "../firebase-config";
import { useFirestoreQuery, useAuthState } from "../hooks";
import * as ROUTES from "../constants/routes"; //TODO: use constants instead all link

import NavBar from "../components/Navbar";

import "../styles/pages/home.sass";

// const groupPhoto = require("../assets/KA-16_photo.jpeg");

function prettyDateByStamp(stamp: number) {
  let prettiedDate = new Date(stamp * 1000).toLocaleTimeString(
    navigator.language,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return prettiedDate;
}

const HomePage: FC = (props) => {
  const { user, initializing } = useAuthState(auth);

  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(usersCollectionRef);
  const users = useFirestoreQuery(usersQuery);

  const lessonsCollectionRef = collection(firestore, "lessons");
  const lessonsQuery = query(
    lessonsCollectionRef,
    orderBy("beginningTime", "asc")
  );
  const lessons = useFirestoreQuery(lessonsQuery);

  // console.log("~~~~~~~~~~~~~~~~ user ~~~~~~~~~~~~~~~~");
  // console.log(user);
  // console.log(initializing);
  // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  return (
    <>
      <NavBar />
      {user ? (
        <Container className="mt-5">
          <h1 className="text-white">
            Home{" "}
            <span className="text-muted fs-3">(logged in as {user.email})</span>
          </h1>
          <Alert variant="dark box mt-5">
            <h2 className="text-white">Schedule</h2>
            <Container className="d-grid gap-3 mt-5">
              <ButtonGroup size="lg">
                <Button
                  variant="danger"
                  href="https://meet.google.com/bwy-tbvf-kfr"
                  size="lg"
                >
                  <h4>
                    Join <b>current</b> conference
                  </h4>
                </Button>
                <Button
                  variant="success"
                  href="https://meet.google.com/bwy-tbvf-kfr"
                  size="lg"
                >
                  <h4>
                    Join <b>next</b> conference
                  </h4>
                </Button>
              </ButtonGroup>
            </Container>
            <Container className="d-grid gap-3 mt-5">
              {lessons?.map((lesson: any, index: number) => (
                <Row key={lesson.id}>
                  <Col xs={1}>
                    <Row>
                      <Col xs={12} className="lesson-time">
                        <span className="text-muted">
                          {prettyDateByStamp(lesson.beginningTime.seconds)}
                        </span>
                      </Col>
                      <Col xs={12} className="lesson-time">
                        <span className="text-muted lesson-time">
                          {prettyDateByStamp(lesson.endTime.seconds)}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={11}>
                    <Button
                      // disabled={true}
                      variant="secondary"
                      href={lesson.conferenceLink}
                      className="lesson-btn"
                    >
                      <Row>
                        <Col xs={{ span: 1 }} className="lesson-number">
                          <h4>{index + 1}.</h4>
                        </Col>
                        <Col xs={10} className="lesson-name">
                          <h4>{lesson.name}</h4>
                        </Col>
                      </Row>
                    </Button>
                  </Col>
                </Row>
              ))}
            </Container>
          </Alert>
          <Alert variant="dark box mt-5">
            <h2 className="text-white">Users</h2>
            <Container className="d-grid gap-3 mt-5">
              <ul>
                {users?.map((doc: any) => (
                  <li key={doc.id}>
                    <span className="text-white">{doc.id}</span>
                  </li>
                ))}
              </ul>
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
