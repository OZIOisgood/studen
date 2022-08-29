import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Container,
  Alert,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  query,
  where,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { PrivateRoute, GroupRoute, ErrorModal } from "../components";
import { FirebaseContext } from "../context/firebase";
import {
  getPrettyDateByStamp,
  getPrettyTimeByStamp,
  getTimeNow,
  getUser,
} from "../utils";
import { BsFillFileEarmarkPlusFill, BsFillTrashFill } from "react-icons/bs";

import "../styles/pages/task.sass";
import moment from "moment";

const TaskPage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);
  const params = useParams();
  const user = getUser();

  // Error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  //

  // getGroup
  const [group, setGroup] = useState<DocumentData | undefined>({});

  const groupRef = doc(firestore, "groups", `${params.groupID}`);
  useEffect(() => {
    const getGroup = async () => {
      const data = await getDoc(groupRef);
      setGroup(data.data());
    };

    getGroup();
    // eslint-disable-next-line
  }, []);

  // getTask
  const [task, setTask] = useState<DocumentData | undefined>({});

  const taskRef = doc(firestore, "homeworks", `${params.taskID}`);
  useEffect(() => {
    const getTask = async () => {
      const data = await getDoc(taskRef);
      setTask(data.data());
    };

    getTask();
    // eslint-disable-next-line
  }, []);
  //

  //courses
  const coursesCollectionRef = collection(firestore, "courses");
  const coursesQuery = query(
    coursesCollectionRef,
    where("group", "==", params.groupID)
  );
  const courses = useFirestoreQuery(coursesQuery);
  //

  // answer
  const answersCollectionRef = collection(firestore, "doneHomeworks");
  const answersQuery = query(
    answersCollectionRef,
    where("homework", "==", params.taskID)
  );
  const answers = useFirestoreQuery(answersQuery);
  const answer = answers !== null ? answers[0] : undefined;
  //

  // AddAnswer
  const [showAddAnswer, setShowAddAnswer] = useState(false);

  const [taskAnswer, setTaskAnswer] = useState("");

  const handleCloseAddAnswer = () => setShowAddAnswer(false);
  const handleShowAddAnswer = () => setShowAddAnswer(true);

  const db = getFirestore();

  const handleAddAnswer = async () => {
    try {
      setShowAddAnswer(false);

      const addTimeTimestamp = Timestamp.fromDate(getTimeNow().toDate());

      const newAnswer = {
        answer: taskAnswer,
        homework: params.taskID,
        user: user.id,
        addTime: addTimeTimestamp,
      };

      console.log(newAnswer);

      await addDoc(collection(db, "doneHomeworks"), newAnswer);
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setTaskAnswer("");
    }
  };
  //

  // deleteAnswer
  const [showDeleteAnswer, setShowDeleteAnswer] = useState(false);

  const handleCloseDeleteAnswer = () => setShowDeleteAnswer(false);
  const handleShowDeleteAnswer = () => setShowDeleteAnswer(true);

  const handleDeleteAnswer = async () => {
    try {
      setShowDeleteAnswer(false);

      await deleteDoc(doc(db, "doneHomeworks", answer?.id));
    } catch (error: any) {
      handleShowErrorModal(error.message);
    }
  };
  //

  console.log(answers);
  // console.log(task?.deadlineTime);
  // console.log(moment.unix(task?.deadlineTime));

  return (
    <PrivateRoute>
      <GroupRoute groupUsers={group?.users} userID={user?.id}>
        <Container className="mt-5 task-container">
          <h1 className="text-white">
            <a href={`/groups/${params.groupID}`}>{group?.name}</a>
            <span className="text-muted">{" / "}</span>{" "}
            <a href={`/groups/${params.groupID}/tasks`}>Tasks</a>
            <span className="text-muted">{" / "}</span> {task?.title}
          </h1>

          <Row className="mt-5">
            <Col xs={12} lg={8}>
              <Alert variant="dark box">
                <h1 className="text-white">{task?.title}</h1>
                <h2 className="text-white">
                  {
                    courses?.find((course: any) => course.id === task?.course)
                      ?.name
                  }
                </h2>
                <h3 className="text-white mt-4">{task?.description}</h3>
              </Alert>
              {answer !== undefined ? (
                <Alert variant="dark box">
                  <h1 className="text-white">Your answer:</h1>
                  <h3 className="text-white mt-4">
                    {answer !== undefined
                      ? answer?.answer !== ""
                        ? answer.answer
                        : "Sent without an answer"
                      : null}
                  </h3>
                </Alert>
              ) : null}
            </Col>
            <Col xs={12} lg={4}>
              <Alert variant="dark box d-grid">
                {answer === undefined ? (
                  <>
                    <h3 className="text-white">Answer is not added</h3>
                    <Button
                      size="lg"
                      variant={
                        moment
                          .unix(task?.deadlineTime?.seconds)
                          .isAfter(getTimeNow())
                          ? "success"
                          : "danger"
                      }
                      className="text-white mt-2"
                      onClick={handleShowAddAnswer}
                    >
                      <b>
                        <BsFillFileEarmarkPlusFill className="centered-label" />{" "}
                        Add answer
                      </b>
                    </Button>
                  </>
                ) : (
                  <>
                    <h4 className="text-white">
                      {moment
                        .unix(answer?.addTime?.seconds)
                        .isAfter(getTimeNow())
                        ? "Answer is added"
                        : "Answer is added with delay"}
                    </h4>
                    <Button
                      size="lg"
                      variant="warning"
                      className="text-white mt-2"
                      onClick={handleShowDeleteAnswer}
                    >
                      <b>
                        <BsFillTrashFill className="centered-label" /> Delete
                        answer
                      </b>
                    </Button>
                  </>
                )}
              </Alert>
              {answer !== undefined ? (
                <Alert variant="dark box d-grid">
                  <h4 className="text-white">
                    Answer added:
                    <br />
                    {getPrettyTimeByStamp(answer?.addTime)}{" "}
                    {getPrettyDateByStamp(answer?.addTime)}
                  </h4>
                </Alert>
              ) : null}
              <Alert variant="dark box d-grid">
                <h4 className="text-white">
                  Deadline:
                  <br />
                  {getPrettyTimeByStamp(task?.deadlineTime)}{" "}
                  {getPrettyDateByStamp(task?.deadlineTime)}
                </h4>
              </Alert>
              <Alert variant="dark box d-grid">
                <h4 className="text-white">
                  Created:
                  <br />
                  {getPrettyTimeByStamp(task?.createTime)}{" "}
                  {getPrettyDateByStamp(task?.deadlineTime)}
                </h4>
              </Alert>
            </Col>
          </Row>

          <Modal
            show={showDeleteAnswer}
            onHide={handleCloseDeleteAnswer}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Deleting the answer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Title className="fs-5 text-secondary">
                {`Are you sure you want to delete this answer?`}
              </Modal.Title>
              <Form>
                <div className="d-grid mt-4">
                  <Button
                    variant="danger"
                    className="text-white"
                    onClick={() => {
                      handleDeleteAnswer();
                    }}
                  >
                    <b>Delete answer</b>
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showAddAnswer} onHide={handleCloseAddAnswer} centered>
            <Modal.Header closeButton>
              <Modal.Title>Adding answer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3 task-answer">
                  <Form.Label>Task answer</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter answer"
                    as="textarea"
                    rows={3}
                    onChange={(event: any) => {
                      setTaskAnswer(event.target.value);
                    }}
                  />
                </Form.Group>

                <div className="d-grid mt-5">
                  <Button
                    variant="info"
                    className="text-white"
                    onClick={handleAddAnswer}
                  >
                    <b>
                      <BsFillFileEarmarkPlusFill className="centered-label" />{" "}
                      Add task
                    </b>
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          <ErrorModal
            modalTitle="Error detected"
            buttonTitle="Try again"
            showErrorModal={showErrorModal}
            handleCloseErrorModal={handleCloseErrorModal}
            errorMessage={errorMessage}
          />
        </Container>
      </GroupRoute>
    </PrivateRoute>
  );
};

export default TaskPage;
