import { FC } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { getPrettyDateByStamp, getTimeNow } from "../utils";

import moment from "moment";
import "../styles/components/tasks.sass";

type TasksProps = {
  courses: any;
  allTasks: any;
  doneTasks: any;
  groupID?: string;
};

export const Tasks: FC<TasksProps> = ({
  courses,
  allTasks,
  doneTasks,
  groupID,
}) => {
  let doneHomeworksList = doneTasks?.map((doneHomework: any) => {
    return allTasks?.find(
      (homework: any) => homework.id === doneHomework.homework
    );
  });

  let toDoHomeworksList: any[] = [];
  let overdueHomeworksList: any[] = [];

  allTasks?.forEach((homework: any) => {
    if (
      !doneHomeworksList?.find(
        (doneHomework: any) => doneHomework.id === homework.id
      ) &&
      moment.unix(homework.deadlineTime.seconds).isAfter(getTimeNow())
    ) {
      toDoHomeworksList.push(homework);
    } else if (
      !doneHomeworksList?.find(
        (doneHomework: any) => doneHomework.id === homework.id
      ) &&
      moment.unix(homework.deadlineTime.seconds).isBefore(getTimeNow())
    ) {
      overdueHomeworksList.push(homework);
    }
  });

  // overdueHomeworksList = [];
  // toDoHomeworksList = [];

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
        <h3 className="text-white">Overdue tasks:</h3>
        {overdueHomeworksList?.length !== 0 ? (
          overdueHomeworksList?.map((task: any, index: number) => {
            return (
              <Row key={task.id}>
                <Col xs={12} md={2}>
                  <span className="text-muted">
                    {getPrettyDateByStamp(task.deadlineTime)}
                  </span>
                </Col>
                <Col xs={12} md={10} className="d-grid">
                  <Button variant="danger" target="_blank">
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
          })
        ) : (
          <h3 className="text-muted text-center">No tasks are overdue</h3>
        )}
        <h3 className="text-white">To Do tasks:</h3>
        {toDoHomeworksList?.length !== 0 ? (
          toDoHomeworksList?.map((task: any, index: number) => {
            return (
              <Row key={task.id}>
                <Col xs={12} md={2}>
                  <span className="text-muted">
                    {getPrettyDateByStamp(task.deadlineTime)}
                  </span>
                </Col>
                <Col xs={12} md={10} className="d-grid">
                  <Button variant="warning" target="_blank">
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
          })
        ) : (
          <h3 className="text-muted text-center">No tasks to do</h3>
        )}
      </Container>
    </Alert>
  );
};
