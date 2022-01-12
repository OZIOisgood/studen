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
import moment from "moment";
import { getPrettyTimeByStamp } from "../utils";
import { Avatar } from "../components/Avatar";
import * as ROUTES from "../constants/routes"; //TODO: use constants instead all link

import NavBar from "../components/Navbar";

import "../styles/pages/home.sass";

const HomePage: FC = (props) => {
  console.clear();

  const { user, initializing } = useAuthState(auth);

  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(usersCollectionRef);
  const users = useFirestoreQuery(usersQuery);

  const startOfDay = moment().startOf("day").toDate();
  const endOfDay = moment().endOf("day").toDate();

  console.log("~~~~~~~~~~~~~~~~ moment ~~~~~~~~~~~~~~~~");
  console.log(startOfDay);
  console.log(endOfDay);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  const lessonsCollectionRef = collection(firestore, "lessons");
  const lessonsQuery = query(
    lessonsCollectionRef,
    where("beginningTime", ">=", startOfDay),
    where("beginningTime", "<=", endOfDay),
    orderBy("beginningTime", "asc")
  );
  const lessons = useFirestoreQuery(lessonsQuery);

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
          <Alert variant="dark box mt-5">
            <h2 className="text-white">Schedule</h2>
            <Container className="d-grid gap-3 mt-5">
              <h3 className="text-white">Join conference:</h3>
              <ButtonGroup size="lg">
                <Button variant="danger" href="#" size="lg">
                  <h4>
                    <b>previous</b>
                  </h4>
                </Button>
                <Button
                  variant="warning"
                  href="#"
                  size="lg"
                  className="text-white btn-warning"
                >
                  <h4>
                    <b>current</b>
                  </h4>
                </Button>
                <Button variant="success" href="#" size="lg">
                  <h4>
                    <b>next</b>
                  </h4>
                </Button>
              </ButtonGroup>
            </Container>
            <Container className="d-grid gap-3 mt-5">
              {lessons?.map((lesson: any, index: number) => {
                const lessonBeginningTimeMoment = moment(
                  lesson.beginningTime.seconds * 1000
                );
                const lessonEndTimeMoment = moment(
                  lesson.endTime.seconds * 1000
                );
                const buttonClasses = `lesson-btn ${
                  lessonBeginningTimeMoment.isBefore(moment()) &&
                  lessonEndTimeMoment.isAfter(moment())
                    ? "btn-warning text-white"
                    : ""
                }`;

                return (
                  <Row key={lesson.id}>
                    <Col xs={1}>
                      <Row>
                        <Col xs={12} className="lesson-time">
                          <span className="text-muted">
                            {getPrettyTimeByStamp(lesson.beginningTime)}
                          </span>
                        </Col>
                        <Col xs={12} className="lesson-time">
                          <span className="text-muted lesson-time">
                            {getPrettyTimeByStamp(lesson.endTime)}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={11}>
                      <Button
                        disabled={moment(
                          lesson.endTime.seconds * 1000
                        ).isBefore(moment())}
                        variant="secondary"
                        href={lesson.conferenceLink}
                        className={buttonClasses}
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
                );
              })}
            </Container>
          </Alert>
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
