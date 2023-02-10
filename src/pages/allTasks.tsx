import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
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
import { Wrapper } from "../components/Wrapper";

import "react-calendar/dist/Calendar.css";
import "../styles/pages/allTasks.sass";

const AllTasksPage: FC = (props) => {
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

  let courses: any = [];
  try {
    const coursesCollectionRef = collection(firestore, "courses");
    const coursesQuery = query(
      coursesCollectionRef,
      where("group", "in", user ? user.groups : [""])
    );

    courses = useFirestoreQuery(coursesQuery);
  } finally {
  }

  const homeworksCollectionRef = collection(firestore, "homeworks");
  const homeworksQuery = query(
    homeworksCollectionRef,
    where("group", "in", user ? user.groups : [""])
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

  return (
    <PrivateRoute>
      <Wrapper
        showBackground
        className="pt-5 tasks-container d-grid gap-3"
      >
        <h1 className="text-white mb-5">
          <a href={`/home`} className="text-decoration-none text-white">
            Home
          </a>
          <span className="text-muted">{" / "}</span> Homeworks
        </h1>

        <TasksList
          tasks={overdueHomeworksList}
          courses={courses}
          buttonClassNames="danger"
          title="Overdue"
          titleNoTasks="No overdue tasks"
          isAdmin={false}
        />

        <TasksList
          tasks={toDoHomeworksList}
          courses={courses}
          buttonClassNames="warning"
          title="To Do"
          titleNoTasks="No tasks to do"
          isAdmin={false}
        />

        <TasksList
          tasks={doneHomeworksList}
          courses={courses}
          buttonClassNames="success"
          title="Done"
          titleNoTasks="No done tasks"
          isAdmin={false}
        />
      </Wrapper>
    </PrivateRoute>
  );
};

export default AllTasksPage;
