import { collection, orderBy, query, where } from "firebase/firestore";
import { FC, useContext } from "react";
import { Groups, PrivateRoute, Schedule } from "../components";
import { FirebaseContext } from "../context/firebase";
import { useFirestoreQuery } from "../hooks";
import { getTimeNow, getUser } from "../utils";
import { Wrapper } from "../components/Wrapper";

import "../styles/pages/home.sass";

const HomePage: FC = (props) => {
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

  let lessons: any = [];
  try {
    const startOfDay = getTimeNow().startOf("day").toDate();
    const endOfDay = getTimeNow().endOf("day").toDate();

    const lessonsCollectionRef = collection(firestore, "lessons");
    const lessonsQuery = query(
      lessonsCollectionRef,
      where("group", "in", user ? user.groups : [""]),
      where("beginningTime", ">=", startOfDay),
      where("beginningTime", "<=", endOfDay),
      orderBy("beginningTime", "asc")
    );

    lessons = useFirestoreQuery(lessonsQuery);
  } finally {
  }

  let myGroups: any = [];
  try {
    const myGroupsCollectionRef = collection(firestore, "groups");
    const myGroupsQuery = query(
      myGroupsCollectionRef,
      where("users", "array-contains", user ? user.id : "")
    );

    myGroups = useFirestoreQuery(myGroupsQuery);
  } finally {
  }

  return (
    <PrivateRoute>
      <Wrapper
        showBackground
        className="pt-5"
      >
        <h1 className="text-white">Home</h1>
        <Schedule courses={courses} lessons={lessons} />
        <Groups title="My groups" groups={myGroups} />
        {/* <Users title="All users" users={users} /> */}
      </Wrapper>
    </PrivateRoute>
  );
};

export default HomePage;
