import React, { FC } from "react";
import {
  Button,
  Container,
  Alert,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import moment from "moment";
import { firestore } from "../firebase-config";
import { collection, query, orderBy, where } from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { getPrettyTimeByStamp, getTimeNow } from "../utils";

import "../styles/components/schedule.sass";

export const Schedule: FC = () => {
  const startOfDay = getTimeNow().startOf("day").toDate();
  const endOfDay = getTimeNow().endOf("day").toDate();

  console.log("~~~~~~~~~~~~~~~~ moment ~~~~~~~~~~~~~~~~");
  console.log(startOfDay);
  console.log(getTimeNow().toDate());
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

  let previousConferenceIndex: number;
  let currentConferenceIndex: number;
  let nextConferenceIndex: number;

  lessons?.map((lesson: any, index: number) => {
    const lessonBeginningTimeMoment = moment(
      lesson.beginningTime.seconds * 1000
    );
    const lessonEndTimeMoment = moment(lesson.endTime.seconds * 1000);

    if (
      lessonBeginningTimeMoment.isBefore(getTimeNow()) &&
      lessonEndTimeMoment.isAfter(getTimeNow())
    ) {
      previousConferenceIndex = index - 1;
      currentConferenceIndex = index;
      nextConferenceIndex = index + 1;
    }
  });

  return (
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
          <Button variant="warning" href="#" size="lg" className="btn-warning">
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
          const lessonEndTimeMoment = moment(lesson.endTime.seconds * 1000);
          let buttonClasses = `lesson-btn`;

          switch (index) {
            case previousConferenceIndex:
              buttonClasses += " btn-danger";
              break;
            case currentConferenceIndex:
              buttonClasses += " btn-warning";
              break;
            case nextConferenceIndex:
              buttonClasses += " btn-success";
              break;
          }

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
                  disabled={moment(lesson.endTime.seconds * 1000).isBefore(
                    getTimeNow()
                  )}
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
  );
};
