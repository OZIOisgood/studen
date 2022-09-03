import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Modal, Form } from "react-bootstrap";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  query,
  where,
  getFirestore,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { PrivateRoute, GroupRoute, TasksList, ErrorModal } from "../components";
import { FirebaseContext } from "../context/firebase";
import { checkUserIsGroupAdmin, getTimeNow, getUser } from "../utils";
import Calendar from "react-calendar";
import moment from "moment";

import "react-calendar/dist/Calendar.css";
import "../styles/pages/tasks.sass";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";

const TasksPage: FC = (props) => {
  console.log("############## TasksPage ##############");
  const { firestore } = useContext(FirebaseContext);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

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

  console.log("allHomeworks:");
  console.log(allHomeworks);

  const doneHomeworksCollectionRef = collection(firestore, "doneHomeworks");
  const doneHomeworksQuery = query(
    doneHomeworksCollectionRef,
    where("user", "==", user.id),
    where("group", "==", params.id)
    // orderBy("deadlineTime", "asc")
  );
  const doneHomeworks = useFirestoreQuery(doneHomeworksQuery);

  console.log("doneHomeworks:");
  console.log(doneHomeworks);

  let doneHomeworksList = doneHomeworks?.map((doneHomework: any) => {
    return allHomeworks?.find(
      (homework: any) => homework.id === doneHomework.homework
    );
  });

  console.log("doneHomeworksList:");
  console.log(doneHomeworksList);

  let toDoHomeworksList: any[] = [];
  let overdueHomeworksList: any[] = [];

  allHomeworks?.forEach((homework: any) => {
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

  console.log("toDoHomeworksList:");
  console.log(toDoHomeworksList);

  console.log("overdueHomeworksList:");
  console.log(overdueHomeworksList);

  ////////////////////////////////////////////////////////////////////////////////////////////////

  const [showAddTask, setShowAddTask] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [courseIndex, setCourseIndex] = useState("");
  const [taskDeadLineTime, setTaskDeadLineTime] = useState("");
  const [taskDeadLineDate, setTaskDeadLineDate] = useState(
    getTimeNow().toDate()
  );
  const [taskDescription, setTaskDescription] = useState("");

  const handleCloseAddTask = () => setShowAddTask(false);
  const handleShowAddTask = () => setShowAddTask(true);

  const db = getFirestore();

  const [fileTask, setFileTask] = useState<any>(null);

  const handleAddTask = async () => {
    try {
      setShowAddTask(false);

      const deadlineTimeTimestamp = Timestamp.fromDate(
        moment(
          `${moment(taskDeadLineDate).format("YYYY-MM-DD")} ${taskDeadLineTime}`
        ).toDate()
      );
      const createTimeTimestamp = Timestamp.fromDate(getTimeNow().toDate());

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
        group: params.id,
        course: courses != null ? courses[Number(courseIndex)].id : "",
        createTime: createTimeTimestamp,
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

            addDoc(collection(db, "homeworks"), newTask);
          });
        });
      } else {
        addDoc(collection(db, "homeworks"), newTask);
      }

      // await addDoc(collection(db, "homeworks"), newTask);
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setTaskTitle("");
      setTaskDescription("");
      setCourseIndex("0");
      setTaskDeadLineTime("");
      setTaskDeadLineDate(getTimeNow().toDate());
      setFileTask(null);
    }
  };

  const handleDateChange = (date: Date) => {
    setTaskDeadLineDate(date);
  };

  // check if User Is Group Admin
  let isAdmin = checkUserIsGroupAdmin(group, user);
  //

  console.log("±±±±±±±±±±±±±±±±± End ±±±±±±±±±±±±±±±±±");
  return (
    <PrivateRoute>
      <GroupRoute groupUsers={group?.users} userID={user?.id}>
        <Container className="mt-5 tasks-container d-grid gap-3">
          <h1 className="text-white mb-5">
            <a
              href={`/groups/${params.id}`}
              className="text-decoration-none text-white"
            >
              {group?.name}
            </a>
            <span className="text-muted">{" / "}</span> Tasks
          </h1>

          <TasksList
            tasks={overdueHomeworksList}
            courses={courses}
            buttonClassNames="danger"
            title="Overdue"
            titleNoTasks="No overdue tasks"
            isAdmin={isAdmin}
          />

          <TasksList
            tasks={toDoHomeworksList}
            courses={courses}
            buttonClassNames="warning"
            title="To Do"
            titleNoTasks="No tasks to do"
            isAdmin={isAdmin}
          />

          <TasksList
            tasks={doneHomeworksList}
            courses={courses}
            buttonClassNames="success"
            title="Done"
            titleNoTasks="No done tasks"
            isAdmin={isAdmin}
          />

          {isAdmin ? (
            <Button
              size="lg"
              variant="info"
              className="text-white mt-2"
              onClick={handleShowAddTask}
            >
              <b>
                <i className="far fa-calendar-plus"></i> Add new task
              </b>
            </Button>
          ) : null}

          <Modal show={showAddTask} onHide={handleCloseAddTask} centered>
            <Modal.Header closeButton>
              <Modal.Title>Adding new task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3 task-title">
                  <Form.Label>
                    Task title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
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
                    type="text"
                    placeholder="Enter description"
                    as="textarea"
                    rows={3}
                    onChange={(event: any) => {
                      setTaskDescription(event.target.value);
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

                <Form.Group className="mb-3 task-course">
                  <Form.Label>
                    Course <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    onChange={(event: any) => {
                      setCourseIndex(event.target.value);
                    }}
                  >
                    <option>Choose course ...</option>
                    {courses?.map((item: any, index: number) => (
                      <option key={index} value={index}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
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
                    className="mt-2"
                    type="text"
                    placeholder='Time format "00:00"'
                    onChange={(event: any) => {
                      setTaskDeadLineTime(event.target.value);
                    }}
                  />
                </Form.Group>

                <div className="d-grid mt-5">
                  <Button
                    variant="info"
                    className="text-white"
                    onClick={handleAddTask}
                  >
                    <b>
                      <i className="far fa-calendar-plus"></i> Add task
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

export default TasksPage;
