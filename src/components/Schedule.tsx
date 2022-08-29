import { FC } from "react";
import {
  Button,
  Container,
  Alert,
  ButtonGroup,
  Row,
  Col,
} from "react-bootstrap";
import moment from "moment";
import {
  getPrettyTimeByStamp,
  getTimeNow,
  usePageReloadInterval,
} from "../utils";

import "../styles/components/schedule.sass";

type ScheduleProps = {
  courses: any;
  lessons: any;
  groupID?: string;
};

export const Schedule: FC<ScheduleProps> = ({ courses, lessons, groupID }) => {
  usePageReloadInterval(10);

  let previousConferenceIndex = -1;
  let currentConferenceIndex = -1;
  let nextConferenceIndex = -1;

  if (lessons.length !== 0) {
    lessons?.forEach((lesson: any, index: number) => {
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

    if (currentConferenceIndex === -1) {
      const nextLessons: any[] = [];

      lessons?.forEach((lesson: any, index: number) => {
        const lessonBeginningTimeMoment = moment(
          lesson.beginningTime.seconds * 1000
        );

        if (lessonBeginningTimeMoment.isAfter(getTimeNow())) {
          nextLessons.push(lesson);
        }
      });

      if (nextLessons.length === 0) {
        previousConferenceIndex = lessons.length - 1;
        currentConferenceIndex = -1;
        nextConferenceIndex = -1;
      } else {
        nextConferenceIndex = lessons.findIndex(
          (lesson: any) => lesson.id === nextLessons[0].id
        );
        previousConferenceIndex = nextConferenceIndex - 1;
      }
    }
  }

  return (
    <Alert variant="dark box mt-5 schedule-container">
      <Row>
        <Col xs={9}>
          <h2 className="text-white">Schedule</h2>
        </Col>
        {groupID ? (
          <Col xs={3} className="d-grid">
            <Button
              variant="info"
              size="lg"
              className="text-white fs-6"
              href={`/groups/${groupID}/schedule/`}
            >
              <b>See all</b>
            </Button>
          </Col>
        ) : null}
      </Row>

      <Container className="d-grid gap-3 mt-5 lesson-btns">
        <h3 className="text-white">Join conference:</h3>
        <ButtonGroup size="lg">
          <Button
            disabled={
              lessons[previousConferenceIndex]
                ? lessons[previousConferenceIndex].conferenceLink === ""
                  ? true
                  : false
                : true
            }
            variant="danger"
            href={
              lessons[previousConferenceIndex]
                ? lessons[previousConferenceIndex].conferenceLink === ""
                  ? "#"
                  : lessons[previousConferenceIndex].conferenceLink
                : "#"
            }
            target="_blank"
            size="lg"
          >
            <h4>
              <b>previous</b>
            </h4>
          </Button>
          <Button
            disabled={
              lessons[currentConferenceIndex]
                ? lessons[currentConferenceIndex].conferenceLink === ""
                  ? true
                  : false
                : true
            }
            variant="warning"
            href={
              lessons[currentConferenceIndex]
                ? lessons[currentConferenceIndex].conferenceLink === ""
                  ? "#"
                  : lessons[currentConferenceIndex].conferenceLink
                : "#"
            }
            target="_blank"
            size="lg"
            className="btn-warning"
          >
            <h4>
              <b>current</b>
            </h4>
          </Button>
          <Button
            disabled={
              lessons[nextConferenceIndex]
                ? lessons[nextConferenceIndex].conferenceLink === ""
                  ? true
                  : false
                : true
            }
            variant="success"
            href={
              lessons[nextConferenceIndex]
                ? lessons[nextConferenceIndex].conferenceLink === ""
                  ? "#"
                  : lessons[nextConferenceIndex].conferenceLink
                : "#"
            }
            target="_blank"
            size="lg"
          >
            <h4>
              <b>next</b>
            </h4>
          </Button>
        </ButtonGroup>
      </Container>
      <Container className="d-grid gap-3 mt-5">
        {lessons.length !== 0 ? (
          lessons?.map((lesson: any, index: number) => {
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
                    disabled={lesson.conferenceLink === "" ? true : false}
                    variant="secondary"
                    href={
                      lesson.conferenceLink !== "" ? lesson.conferenceLink : "#"
                    }
                    target="_blank"
                    className={buttonClasses}
                  >
                    <Row>
                      <Col xs={1} className="lesson-number text-align-right">
                        <h4>{index + 1}.</h4>
                      </Col>
                      <Col xs={11}>
                        <Row>
                          <Col xs={12} md={5} className="lesson-course-name">
                            <h4>
                              {courses != null
                                ? courses.find(
                                    (course: any) => course.id === lesson.course
                                  )?.name
                                : null}
                            </h4>
                          </Col>
                          <Col xs={12} md={7} className="lesson-name">
                            <h4>{lesson.name}</h4>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Button>
                </Col>
              </Row>
            );
          })
        ) : (
          <h2 className="text-muted text-center ">No lessons this day</h2>
        )}
      </Container>
    </Alert>
  );
};
