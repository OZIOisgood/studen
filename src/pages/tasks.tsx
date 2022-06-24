import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { PrivateRoute, GroupRoute, Lessons } from "../components";
import { FirebaseContext } from "../context/firebase";
import { getTimeNow, getPrettyDateByStamp, getUser } from "../utils";
import moment from "moment";

import "../styles/pages/tasks.sass";

const TasksPage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

  const user = getUser();

  const params = useParams();

  const [group, setGroup] = useState<DocumentData | undefined>({});

  const groupRef = doc(firestore, "groups", `${params.id}`);
  useEffect(() => {
    const getGroup = async () => {
      const data = await getDoc(groupRef);
      setGroup(data.data());
    };

    getGroup();
    // eslint-disable-next-line
  }, []);

  const coursesCollectionRef = collection(firestore, "courses");
  const coursesQuery = query(
    coursesCollectionRef,
    where("group", "==", params.id)
  );
  const courses = useFirestoreQuery(coursesQuery);

  const homeworksCollectionRef = collection(firestore, "homeworks");
  const homeworksQuery = query(
    homeworksCollectionRef,
    where("group", "==", params.id)
    // orderBy("deadlineTime", "asc")
  );
  const allHomeworks = useFirestoreQuery(homeworksQuery);

  const doneHomeworksCollectionRef = collection(firestore, "doneHomeworks");
  const doneHomeworksQuery = query(
    doneHomeworksCollectionRef,
    where("user", "==", user.id)
    // orderBy("deadlineTime", "asc")
  );
  const doneHomeworks = useFirestoreQuery(doneHomeworksQuery);

  let doneHomeworksList = doneHomeworks?.map((doneHomework: any) => {
    return allHomeworks?.find(
      (homework: any) => homework.id === doneHomework.homework
    );
  });

  console.log("!!!!!!!!!");

  let toDoHomeworksList: any[] = [];

  allHomeworks?.forEach((homework: any) => {
    if (
      !doneHomeworksList?.find(
        (doneHomework: any) => doneHomework.id === homework.id
      )
    ) {
      toDoHomeworksList.push(homework);
    }
  });

  console.log(toDoHomeworksList);

  console.log("!!!!!!!!!");

  return (
    <PrivateRoute>
      <GroupRoute groupUsers={group?.users} userID={user?.id}>
        <Container className="mt-5 group-schedule-container">
          <h1 className="text-white">
            <a href={`/groups/${params.id}`}>{group?.name}</a>
            <span className="text-muted">{" / "}</span> Tasks
          </h1>

          <Alert variant="dark box mt-5 box">
            <Container className="d-grid gap-3">
              <h2 className="text-white">Overdue:</h2>
              {doneHomeworksList?.map((task: any, index: number) => {
                return (
                  <Row key={`${task?.id}-done-tasks`}>
                    <Col xs={1}>
                      <span className="text-muted">
                        {getPrettyDateByStamp(task?.deadlineTime)}
                      </span>
                    </Col>
                    <Col xs={11} className="d-grid">
                      <Button variant="success" target="_blank">
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
                                        (course: any) =>
                                          course.id === task?.course
                                      )?.name
                                    : null}
                                </h4>
                              </Col>
                              <Col
                                xs={12}
                                md={8}
                                className="task-name text-align-left"
                              >
                                <h4>{task?.title}</h4>
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

          <Alert variant="dark box mt-5 box">
            <Container className="d-grid gap-3">
              <h2 className="text-white">To Do:</h2>
              {toDoHomeworksList?.map((task: any, index: number) => {
                return (
                  <Row key={`${task?.id}-toDo-tasks`}>
                    <Col xs={1}>
                      <span className="text-muted">
                        {getPrettyDateByStamp(task?.deadlineTime)}
                      </span>
                    </Col>
                    <Col xs={11} className="d-grid">
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
                                        (course: any) =>
                                          course.id === task?.course
                                      )?.name
                                    : null}
                                </h4>
                              </Col>
                              <Col
                                xs={12}
                                md={8}
                                className="task-name text-align-left"
                              >
                                <h4>{task?.title}</h4>
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

          <Alert variant="dark box mt-5 box">
            <Container className="d-grid gap-3">
              <h2 className="text-white">Done:</h2>
              {doneHomeworksList?.map((task: any, index: number) => {
                return (
                  <Row key={`${task?.id}-done-tasks`}>
                    <Col xs={1}>
                      <span className="text-muted">
                        {getPrettyDateByStamp(task?.deadlineTime)}
                      </span>
                    </Col>
                    <Col xs={11} className="d-grid">
                      <Button variant="success" target="_blank">
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
                                        (course: any) =>
                                          course.id === task?.course
                                      )?.name
                                    : null}
                                </h4>
                              </Col>
                              <Col
                                xs={12}
                                md={8}
                                className="task-name text-align-left"
                              >
                                <h4>{task?.title}</h4>
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
        </Container>
      </GroupRoute>
    </PrivateRoute>
  );
};

export default TasksPage;
