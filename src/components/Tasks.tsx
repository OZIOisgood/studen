import { FC } from "react";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
import { getPrettyDateByStamp } from "../utils";

import "../styles/components/tasks.sass";

type TasksProps = {
  courses: any;
  tasks: any;
  groupID?: string;
};

export const Tasks: FC<TasksProps> = ({ courses, tasks, groupID }) => {
  return (
    <Alert variant="dark box mt-5 tasks-container">
      <Row>
        <Col xs={9}>
          <h2 className="text-white">Homeworks</h2>
        </Col>
        {groupID ? (
          <Col xs={3} className="d-grid">
            <Button
              variant="info"
              size="lg"
              className="text-white fs-6"
              href={`/groups/${groupID}/tasks/`}
            >
              <b>See all</b>
            </Button>
          </Col>
        ) : null}
      </Row>

      <Container className="d-grid gap-3 mt-5">
        {tasks?.map((task: any, index: number) => {
          return (
            <Row key={task.id}>
              <Col xs={1}>
                <span className="text-muted">
                  {getPrettyDateByStamp(task.deadlineTime)}
                </span>
              </Col>
              <Col xs={11} className="d-grid">
                <Button variant="secondary" target="_blank">
                  <Row>
                    <Col xs={1} className="task-number text-align-right">
                      <h4>{index + 1}.</h4>
                    </Col>
                    <Col xs={11}>
                      <Row>
                        <Col
                          xs={12}
                          md={4}
                          className="task-course-name text-align-left"
                        >
                          <h4>
                            {courses != null
                              ? courses.find(
                                  (course: any) => course.id === task.course
                                )?.name
                              : null}
                          </h4>
                        </Col>
                        <Col
                          xs={12}
                          md={8}
                          className="task-name text-align-left"
                        >
                          <h4>{task.title}</h4>
                        </Col>
                      </Row>
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
