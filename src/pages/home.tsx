import { FC, useContext } from "react";
import { Container } from "react-bootstrap";
import { Schedule, PrivateRoute, Groups, Users } from "../components";
import { getTimeNow } from "../utils";
import { FirebaseContext } from "../context/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";

import "../styles/pages/home.sass";

const HomePage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

  const userJSON = localStorage.getItem("authUser");
  const user = userJSON ? JSON.parse(userJSON) : null;

  // const usersCollectionRef = collection(firestore, "users");
  // const usersQuery = query(usersCollectionRef);
  // const users = useFirestoreQuery(usersQuery);

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
      <Container className="mt-5">
        <h1 className="text-white">Home</h1>
        <Schedule courses={courses} lessons={lessons} />
        <Groups title="My groups" groups={myGroups} />
        {/* <Users title="All users" users={users} /> */}
      </Container>
    </PrivateRoute>
  );
};

export default HomePage;
