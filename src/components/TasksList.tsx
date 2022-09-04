import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import moment from "moment";
import { FC, useContext, useState } from "react";
import {
  Button,
  Container,
  Alert,
  Row,
  Col,
  ButtonGroup,
  Modal,
  Form,
} from "react-bootstrap";
import Calendar from "react-calendar";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import { FirebaseContext } from "../context/firebase";
import { storage } from "../firebase-config";
import {
  checkTime,
  getPrettyDateByStamp,
  getPrettyTimeByStamp,
  getTimeNow,
} from "../utils";
import { ErrorModal } from "./ErrorModal";

type TasksListProps = {
  tasks: any;
  courses: any;
  buttonClassNames: string;
  title: string;
  titleNoTasks: string;
  isAdmin: boolean;
};

export const TasksList: FC<TasksListProps> = ({
  tasks,
  courses,
  buttonClassNames,
  title,
  titleNoTasks,
  isAdmin,
}) => {
  const params = useParams();
  const db = getFirestore();
  const { firestore } = useContext(FirebaseContext);

  // Error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  //

  // deleteTask
  const [taskToDelete, setTaskToDelete] = useState(courses ? courses[0] : null);
  const [showDeleteTask, setShowDeleteTask] = useState(false);

  const handleCloseDeleteTask = () => setShowDeleteTask(false);
  const handleShowDeleteTask = () => setShowDeleteTask(true);

  const handleDeleteTask = async (homeworkID: string) => {
    try {
      setShowDeleteTask(false);

      const answersToDeleteCollectionRef = collection(
        firestore,
        "doneHomeworks"
      );
      const answersToDeleteQuery = query(
        answersToDeleteCollectionRef,
        where("homework", "==", homeworkID)
      );
      const answersToDeleteSnapshot = await getDocs(answersToDeleteQuery);
      const answersToDelete = answersToDeleteSnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));

      answersToDelete.forEach((answer) => {
        if (answer.file.ref !== "") {
          const fileRef = ref(storage, answer?.file.ref);
          deleteObject(fileRef);
        }

        deleteDoc(doc(db, "doneHomeworks", answer.id));
      });

      if (taskToDelete?.file.ref !== "") {
        const fileRef = ref(storage, taskToDelete?.file.ref);
        deleteObject(fileRef);
      }

      await deleteDoc(doc(db, "homeworks", homeworkID));
    } catch (error: any) {
      handleShowErrorModal(error.message);
    }
  };
  //

  // changeTask
  const [taskToChange, setTaskToChange] = useState(courses ? courses[0] : null);

  const [showChangeTask, setShowChangeTask] = useState(false);

  const handleCloseChangeTask = () => setShowChangeTask(false);
  const handleShowChangeTask = () => setShowChangeTask(true);

  const handleDateChange = (date: Date) => {
    setTaskDeadLineDate(date);
  };

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadLineTime, setTaskDeadLineTime] = useState("");
  const [taskDeadLineDate, setTaskDeadLineDate] = useState(
    getTimeNow().toDate()
  );
  const [fileTask, setFileTask] = useState<any>(null);

  const handleChangeTask = async () => {
    try {
      setShowChangeTask(false);

      if (taskTitle === "") throw new Error("You haven't entered task title.");
      if (taskDescription === "")
        throw new Error("You haven't entered task description.");
      if (taskDeadLineTime === "")
        throw new Error("You haven't entered deadline time of lesson.");
      if (!checkTime(taskDeadLineTime))
        throw new Error(
          'You entered incorrect deadline time of lesson.\nPlese enter it in format "00:00".'
        );

      const deadlineTimeTimestamp = Timestamp.fromDate(
        moment(
          `${moment(taskDeadLineDate).format("YYYY-MM-DD")} ${taskDeadLineTime}`
        ).toDate()
      );

      let fileURL: string | void = ""; // link for the file
      let fileREF: string = ""; // `homeworkFiles/${v4}`
      let fileName: string = ""; // name of the file + extension

      const newTask = {
        title: taskTitle,
        description: taskDescription,
        file: {
          URL: fileURL,
          ref: fileREF,
          name: fileName,
        },
        deadlineTime: deadlineTimeTimestamp,
      };

      if (fileTask != null) {
        fileREF = v4();

        const fileExtension = fileTask.name.split(".").pop();
        newTask.file.ref = `homeworkFiles/${fileREF}.${fileExtension}`;

        const fileRef = ref(storage, newTask.file.ref);
        await uploadBytes(fileRef, fileTask).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            newTask.file.URL = url;
            newTask.file.name = fileTask?.name;

            const changeDocRef = doc(db, "homeworks", taskToChange.id);
            updateDoc(changeDocRef, newTask);
          });
        });
      } else {
        const changeDocRef = doc(db, "homeworks", taskToChange.id);
        await updateDoc(changeDocRef, newTask);
      }
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setTaskTitle("");
      setTaskDescription("");
      setTaskDeadLineTime("");
      setTaskDeadLineDate(getTimeNow().toDate());
      setFileTask(null);
    }
  };
  //

  return (
    <Alert variant="dark box">
      <Container className="d-grid gap-3">
        <h2 className="text-white">{title}</h2>
        {tasks.length !== 0 ? (
          tasks?.map((task: any, index: number) => {
            return (
              <Row key={`${task?.id}-done-tasks`}>
                <Col xs={12} md={2}>
                  <span className="text-muted">
                    {getPrettyDateByStamp(task?.deadlineTime)}
                  </span>
                </Col>
                <Col xs={12} md={10} className="d-grid">
                  <Row>
                    <Col
                      xs={isAdmin ? 9 : 12}
                      md={isAdmin ? 10 : 12}
                      className="d-grid gap-3"
                    >
                      <Button
                        variant={buttonClassNames}
                        href={`/groups/${task?.group}/tasks/${task?.id}`}
                      >
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
                    {isAdmin ? (
                      <Col xs={3} md={2} className="d-grid gap-3">
                        <ButtonGroup>
                          <Button
                            variant="secondary"
                            className="task-change-btn"
                            onClick={() => {
                              // console.log(task);
                              // console.log(task.deadlineTime);
                              // console.log(
                              //   getPrettyTimeByStamp(task.deadlineTime)
                              // );
                              setTaskToChange(task);
                              handleShowChangeTask();

                              setTaskTitle(task.title);
                              setTaskDescription(task.description);
                              setTaskDeadLineTime(
                                getPrettyTimeByStamp(task.deadlineTime)
                              );
                              // setCourseIndex(courses.indexOf(task.course));
                              setTaskDeadLineDate(
                                moment.unix(task.deadlineTime.seconds).toDate()
                              );
                            }}
                          >
                            <i className="fas fa-cog"></i>
                          </Button>
                          <Button
                            variant="danger"
                            className="task-delete-btn"
                            onClick={() => {
                              setTaskToDelete(task);
                              handleShowDeleteTask();
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </ButtonGroup>
                      </Col>
                    ) : null}
                  </Row>
                </Col>
              </Row>
            );
          })
        ) : (
          <h2 className="text-muted">{titleNoTasks}</h2>
        )}

        <Modal show={showChangeTask} onHide={handleCloseChangeTask} centered>
          <Modal.Header closeButton>
            <Modal.Title>Changing task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3 task-title">
                <Form.Label>
                  Task title <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  defaultValue={taskTitle}
                  type="text"
                  placeholder="Enter title"
                  onChange={(event: any) => {
                    setTaskTitle(event.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3 task-description">
                <Form.Label>
                  Task description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  defaultValue={taskDescription}
                  type="text"
                  placeholder="Enter description"
                  as="textarea"
                  rows={3}
                  onChange={(event: any) => {
                    setTaskDescription(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 justify-content-center">
                <Form.Label>
                  Task deadline <span className="text-danger">*</span>
                </Form.Label>
                <Calendar
                  onChange={handleDateChange}
                  value={taskDeadLineDate}
                  locale="en"
                  className="m-auto mb-2"
                />
                <Form.Control
                  defaultValue={taskDeadLineTime}
                  className="mt-2"
                  type="text"
                  placeholder='Time format "00:00"'
                  onChange={(event: any) => {
                    setTaskDeadLineTime(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 task-answer">
                <Form.Label>Additional file</Form.Label>
                <Form.Control
                  type="file"
                  placeholder="Add file"
                  onChange={(event: any) => {
                    setFileTask(event.target.files[0]);
                  }}
                />
              </Form.Group>

              <div className="d-grid mt-5">
                <Button
                  variant="info"
                  className="text-white"
                  onClick={handleChangeTask}
                >
                  <b>
                    <i className="far fa-calendar-plus"></i> Change task
                  </b>
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showDeleteTask} onHide={handleCloseDeleteTask} centered>
          <Modal.Header closeButton>
            <Modal.Title>Deleting the task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Title className="fs-5 text-secondary">
              {`Are you sure you want to delete ${taskToDelete?.title}?`}
            </Modal.Title>
            <Form>
              <div className="d-grid mt-4">
                <Button
                  variant="danger"
                  className="text-white"
                  onClick={() => {
                    console.log("^^^ Deleting the task ^^^");
                    console.log(`courseId: ${taskToDelete?.id}`);

                    handleDeleteTask(taskToDelete?.id);
                  }}
                >
                  <b>Delete task</b>
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
    </Alert>
  );
};
