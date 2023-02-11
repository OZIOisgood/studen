import {
  collection, query,
  where
} from "firebase/firestore";
import moment from "moment";
import { FC, useContext } from "react";
import { PrivateRoute, TasksList, Wrapper } from "../components";
import { FirebaseContext } from "../context/firebase";
import { useFirestoreQuery } from "../hooks";
import { getTimeNow, getUser } from "../utils";

import "react-calendar/dist/Calendar.css";
import "../styles/pages/allTasks.sass";

const AllTasksPage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

  const user = getUser();

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
  );
  const allHomeworks = useFirestoreQuery(homeworksQuery);

  const doneHomeworksCollectionRef = collection(firestore, "doneHomeworks");
  const doneHomeworksQuery = query(
    doneHomeworksCollectionRef,
    where("user", "==", user.id)
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
