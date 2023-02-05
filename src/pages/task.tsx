import { FC, useContext, useEffect, useRef, useState } from "react";
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
  updateDoc,
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
import {
  BsFillFileEarmarkFill,
  BsFillFileEarmarkPlusFill,
} from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

import "../styles/pages/task.sass";
import moment from "moment";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../firebase-config";
import { validateFile } from "../utils/validation/uploadedFileValidation";

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
  const [fileTaskAnswer, setFileTaskAnswer] = useState<any>(null);
  const fileInputRef = useRef(null);
  const [showFileWarning, setShowFileWarning] = useState(false);

  const setInputsToDefault = () => {
    setShowAddAnswer(false);
    setTaskAnswer("");
    setFileTaskAnswer(null);
  };

  const handleCloseAddTask = () => setInputsToDefault();
  const handleCloseAddAnswer = () => setShowAddAnswer(false);
  const handleShowAddAnswer = () => setShowAddAnswer(true);

  const db = getFirestore();

  const handleAddAnswer = async () => {
    try {
      setShowAddAnswer(false);

      const addTimeTimestamp = Timestamp.fromDate(getTimeNow().toDate());

      let fileURL: string | void = ""; // link for the file
      let fileREF: string = ""; // `homeworkAnswerFiles/${v4}`
      let fileName: string = ""; // name of the file + extension

      const newAnswer = {
        answer: taskAnswer,
        file: {
          URL: fileURL,
          ref: fileREF,
          name: fileName,
        },
        mark: 0,
        notChecked: true,
        group: params.groupID,
        homework: params.taskID,
        user: user.id,
        lastEditTime: addTimeTimestamp,
        addTime: addTimeTimestamp,
      };

      if (fileTaskAnswer != null) {
        fileREF = v4();

        const fileExtension = fileTaskAnswer.name.split(".").pop();
        newAnswer.file.ref = `homeworkAnswerFiles/${fileREF}.${fileExtension}`;

        const fileRef = ref(storage, newAnswer.file.ref);
        await uploadBytes(fileRef, fileTaskAnswer).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            newAnswer.file.URL = url;
            newAnswer.file.name = fileTaskAnswer?.name;

            addDoc(collection(db, "doneHomeworks"), newAnswer);
          });
        });
      } else {
        addDoc(collection(db, "doneHomeworks"), newAnswer);
      }
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setInputsToDefault();
    }
  };
  //

  // editAnswer
  const [showEditAnswer, setShowEditAnswer] = useState(false);

  const handleCloseEditAnswer = () => setShowEditAnswer(false);
  const handleShowEditAnswer = () => setShowEditAnswer(true);

  const handleEditAnswer = async () => {
    try {
      setShowEditAnswer(false);

      if (answer?.file.ref !== "") {
        const fileRef = ref(storage, answer?.file.ref);
        deleteObject(fileRef);
      }

      const editTimeTimestamp = Timestamp.fromDate(getTimeNow().toDate());

      let fileURL: string | void = ""; // link for the file
      let fileREF: string = ""; // `homeworkAnswerFiles/${v4}`
      let fileName: string = ""; // name of the file + extension

      const newAnswer = {
        answer: taskAnswer,
        file: {
          URL: fileURL,
          ref: fileREF,
          name: fileName,
        },
        notChecked: true,
        lastEditTime: editTimeTimestamp,
      };

      if (fileTaskAnswer != null) {
        fileREF = v4();

        const fileExtension = fileTaskAnswer.name.split(".").pop();
        newAnswer.file.ref = `homeworkAnswerFiles/${fileREF}.${fileExtension}`;

        const fileRef = ref(storage, newAnswer.file.ref);
        await uploadBytes(fileRef, fileTaskAnswer).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            newAnswer.file.URL = url;
            newAnswer.file.name = fileTaskAnswer?.name;

            const changeDocRef = doc(db, "doneHomeworks", answer?.id);
            updateDoc(changeDocRef, newAnswer);
          });
        });
      } else {
        const changeDocRef = doc(db, "doneHomeworks", answer?.id);
        await updateDoc(changeDocRef, newAnswer);
      }
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setInputsToDefault();
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

      if (answer?.file.ref !== "") {
        const fileRef = ref(storage, answer?.file.ref);
        deleteObject(fileRef);
      }

      await deleteDoc(doc(db, "doneHomeworks", answer?.id));
    } catch (error: any) {
      handleShowErrorModal(error.message);
    }
  };
  //

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
              <Alert variant="dark box d-grid">
                <h1 className="text-white">{task?.title}</h1>
                <h2 className="text-white">
                  {
                    courses?.find((course: any) => course.id === task?.course)
                      ?.name
                  }
                </h2>
                <h3 className="text-white mt-4">{task?.description}</h3>
                {task?.file?.URL !== "" ? (
                  <Button
                    size="lg"
                    variant={"outline-light"}
                    className="mt-4"
                    href={task?.file?.URL}
                    target="_blank"
                  >
                    <Row>
                      <Col xs={2}>
                        <h1 className="m-0">
                          <BsFillFileEarmarkFill className="centered-label" />
                        </h1>
                      </Col>
                      <Col xs={10}>
                        <h3 className="m-0 text-align-left mt-1">
                          {task?.file?.name}
                        </h3>
                      </Col>
                    </Row>
                  </Button>
                ) : (
                  <h3 className="text-white mt-3">
                    Sent without an additional file
                  </h3>
                )}
              </Alert>
              {answer !== undefined ? (
                <Alert variant="dark box d-grid">
                  <h1 className="text-white">Your answer:</h1>
                  <h3 className="text-white mt-3">
                    {answer !== undefined
                      ? answer?.answer !== ""
                        ? answer.answer
                        : "Sent without an answer"
                      : null}
                  </h3>
                  {answer?.file?.URL !== "" ? (
                    <Button
                      size="lg"
                      variant={"outline-light"}
                      className="mt-4"
                      href={answer?.file.URL}
                      target="_blank"
                    >
                      <Row>
                        <Col xs={2}>
                          <h1 className="m-0">
                            <BsFillFileEarmarkFill className="centered-label" />
                          </h1>
                        </Col>
                        <Col xs={10}>
                          <h3 className="m-0 text-align-left mt-1">
                            {answer?.file.name}
                          </h3>
                        </Col>
                      </Row>
                    </Button>
                  ) : (
                    <h3 className="text-white mt-3">
                      Sent without an additional file
                    </h3>
                  )}
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
                        .unix(answer?.lastEditTime?.seconds)
                        .isAfter(getTimeNow())
                        ? "Answer is added"
                        : "Answer is added with delay"}
                    </h4>
                    <Button
                      size="lg"
                      variant="warning"
                      className="text-white mt-2"
                      onClick={handleShowEditAnswer}
                    >
                      <b>
                        <AiFillEdit className="centered-label" /> Edit answer
                      </b>
                    </Button>
                  </>
                )}
              </Alert>
              {answer !== undefined ? (
                <Alert variant="dark box d-grid">
                  <h4 className="text-white">
                    Your mark: <b>{answer?.mark + " / " + task?.maxMark}</b>
                  </h4>
                </Alert>
              ) : null}
              {answer !== undefined ? (
                <>
                  {answer?.addTime.seconds !== answer?.lastEditTime.seconds ? (
                    <Alert variant="dark box d-grid">
                      <h4 className="text-white">
                        Last edit:
                        <br />
                        {getPrettyTimeByStamp(answer?.lastEditTime)}{" "}
                        {getPrettyDateByStamp(answer?.lastEditTime)}
                      </h4>
                    </Alert>
                  ) : null}
                  <Alert variant="dark box d-grid">
                    <h4 className="text-white">
                      Answer added:
                      <br />
                      {getPrettyTimeByStamp(answer?.addTime)}{" "}
                      {getPrettyDateByStamp(answer?.addTime)}
                    </h4>
                  </Alert>
                </>
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

          <Modal show={showEditAnswer} onHide={handleCloseEditAnswer} centered>
            <Modal.Header closeButton>
              <Modal.Title>Editing the answer</Modal.Title>
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

                <Form.Group className="mb-3 task-file">
                  <Form.Label>Additional file</Form.Label>
                  <Form.Control
                    isInvalid={showFileWarning}
                    ref={fileInputRef}
                    type="file"
                    placeholder="Add file"
                    onChange={(event: any) => {
                      const file = event.target.files[0];

                      if (validateFile(file)) {
                        setFileTaskAnswer(file);
                        setShowFileWarning(false);
                      } else {
                        (fileInputRef.current as any).value = "";
                        setShowFileWarning(true);
                      }
                    }}
                  />
                  <Form.Label
                    className={`text-${
                      showFileWarning ? "danger" : "secondary"
                    }`}
                  >
                    The file must be less than 50 MB
                  </Form.Label>
                </Form.Group>

                <div className="d-grid mt-5">
                  <Button
                    variant="info"
                    className="text-white"
                    onClick={() => {
                      handleEditAnswer();
                    }}
                  >
                    <b>
                      <AiFillEdit className="centered-label" /> Edit task
                    </b>
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

                <Form.Group className="mb-3 task-file">
                  <Form.Label>Additional file</Form.Label>
                  <Form.Control
                    isInvalid={showFileWarning}
                    ref={fileInputRef}
                    type="file"
                    placeholder="Add file"
                    onChange={(event: any) => {
                      const file = event.target.files[0];

                      if (validateFile(file)) {
                        setFileTaskAnswer(file);
                        setShowFileWarning(false);
                      } else {
                        (fileInputRef.current as any).value = "";
                        setShowFileWarning(true);
                      }
                    }}
                  />
                  <Form.Label
                    className={`text-${
                      showFileWarning ? "danger" : "secondary"
                    }`}
                  >
                    The file must be less than 50 MB
                  </Form.Label>
                </Form.Group>

                <div className="d-grid mt-5">
                  <Button
                    variant="info"
                    className="text-white"
                    onClick={() => {
                      handleAddAnswer();
                    }}
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
