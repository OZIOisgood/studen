import { FC, useContext } from "react";
import { Container } from "react-bootstrap";
import { Schedule, PrivateRoute, Users } from "../components";
import { getTimeNow, usePageReloadInterval } from "../utils";
import { FirebaseContext } from "../context/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";

import "../styles/pages/home.sass";

const HomePage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

  const userJSON = localStorage.getItem("authUser");
  const user = userJSON ? JSON.parse(userJSON) : null;

  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(usersCollectionRef);
  const users = useFirestoreQuery(usersQuery);

  const startOfDay = getTimeNow().startOf("day").toDate();
  const endOfDay = getTimeNow().endOf("day").toDate();

  const lessonsCollectionRef = collection(firestore, "lessons");
  const lessonsQuery = query(
    lessonsCollectionRef,
    where("group", "in", user.groups),
    where("beginningTime", ">=", startOfDay),
    where("beginningTime", "<=", endOfDay),
    orderBy("beginningTime", "asc")
  );
  const lessons = useFirestoreQuery(lessonsQuery);

  return (
    <PrivateRoute>
      <Container className="mt-5">
        <h1 className="text-white">Home</h1>
        <Schedule lessons={lessons} />
        <Users title="All users" users={users} />
      </Container>
    </PrivateRoute>
  );
};

export default HomePage;
