import { FC, useContext, useEffect, useRef, useState } from "react";
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
import {
  checkTime,
  checkUserIsGroupAdmin,
  getTimeNow,
  getUser,
} from "../utils";
import Calendar from "react-calendar";
import moment from "moment";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config";
import { validateFile } from "../utils/validation/uploadedFileValidation";
import { Wrapper } from "../components/Wrapper";

import "react-calendar/dist/Calendar.css";
import "../styles/pages/tasks.sass";

const TasksPage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);
  const user = getUser();
  const params = useParams();

  // Error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  //

  // group
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
  //

  // courses
  const coursesCollectionRef = collection(firestore, "courses");
  const coursesQuery = query(
    coursesCollectionRef,
    where("group", "==", params.id)
  );
  const courses = useFirestoreQuery(coursesQuery);
  //

  // tasks
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
    where("user", "==", user.id),
    where("group", "==", params.id)
    // orderBy("deadlineTime", "asc")
  );
  const doneHomeworks = useFirestoreQuery(doneHomeworksQuery);

  let doneHomeworksList = doneHomeworks?.map((doneHomework: any) => {
    return allHomeworks?.find(
      (homework: any) => homework.id === doneHomework.homework
    );
  });

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
  //

  // addTask
  const [showAddTask, setShowAddTask] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [courseIndex, setCourseIndex] = useState("Choose course ...");
  const [taskDeadLineTime, setTaskDeadLineTime] = useState("");
  const [taskDeadLineDate, setTaskDeadLineDate] = useState(
    getTimeNow().toDate()
  );
  const [taskDescription, setTaskDescription] = useState("");
  const [taskMaxMark, setTaskMaxMark] = useState("");
  
  const fileInputRef = useRef(null);
  const [fileTask, setFileTask] = useState<any>(null);
  const [showFileWarning, setShowFileWarning] = useState(false);


  const setInputsToDefault = () => {
    setShowAddTask(false);
    setTaskTitle("");
    setTaskDescription("");
    setCourseIndex("Choose course ...");
    setTaskDeadLineTime("");
    setTaskDeadLineDate(getTimeNow().toDate());
    setFileTask(null);
  };

  const handleCloseAddTask = () => setInputsToDefault();
  const handleShowAddTask = () => setShowAddTask(true);

  const db = getFirestore();

  const handleAddTask = async () => {
    try {
      setShowAddTask(false);

      if (taskTitle === "") throw new Error("You haven't entered task title.");
      if (taskDescription === "")
        throw new Error("You haven't entered task description.");
      if (courseIndex === "Choose course ...")
        throw new Error("You haven't choosed course.");
      if (taskDeadLineTime === "")
        throw new Error("You haven't entered deadline time of lesson.");
      if (!checkTime(taskDeadLineTime))
        throw new Error(
          'You entered incorrect deadline time of lesson.\nPlese enter it in format "00:00".'
        );
      if (taskMaxMark === "")
        throw new Error("You haven't entered maximum mark.");

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
        maxMark: parseInt(taskMaxMark),
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
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setInputsToDefault();
    }
  };
  //

  // date Changed
  const handleDateChange = (date: Date) => {
    setTaskDeadLineDate(date);
  };
  //

  // check if User Is Group Admin
  let isAdmin = checkUserIsGroupAdmin(group, user);
  //
  
  return (
    <PrivateRoute>
      <GroupRoute groupUsers={group?.users} userID={user?.id}>
        <Wrapper
          showBackground
          className="pt-5 tasks-container d-grid gap-3"
        >
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
                        setFileTask(file);
                        setShowFileWarning(false);
                      } else {
                        (fileInputRef.current as any).value = "";
                        setShowFileWarning(true);
                      }
                    }}
                  />
                  <Form.Label
                    className={
                      `text-${
                      showFileWarning ? 'danger' : 'secondary'
                      }`
                    }>
                    The file must be less than 50 MB
                  </Form.Label>
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

                <Form.Group className="mb-3 task-max-mark">
                  <Form.Label>
                    Task maximum mark <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="Enter maximum mark"
                    onChange={(event: any) => {
                      setTaskMaxMark(event.target.value);
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
        </Wrapper>
      </GroupRoute>
    </PrivateRoute>
  );
};

export default TasksPage;
