import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Alert, Row, Col } from "react-bootstrap";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { PrivateRoute, Avatar, Users, Schedule } from "../components";
import { FirebaseContext } from "../context/firebase";
// import * as ROUTES from "../constants/routes";

import "../styles/pages/group.sass";
import { getTimeNow, usePageReloadInterval } from "../utils";

const GroupPage: FC = (props) => {
  const { auth, firestore, user, initializing } = useContext(FirebaseContext);

  const params = useParams();

  const [group, setGroup] = useState<DocumentData | undefined>({});
  // const [users, setUsers] = useState<DocumentData | null>([]);

  const groupRef = doc(firestore, "groups", `${params.id}`);
  useEffect(() => {
    const getGroup = async () => {
      const data = await getDoc(groupRef);
      setGroup(data.data());
    };

    getGroup();
    // eslint-disable-next-line
  }, []);

  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(
    usersCollectionRef,
    where("groups", "array-contains", params.id)
  );
  const users = useFirestoreQuery(usersQuery);
  // useEffect(() => {
  //   const getGroup = async () => {
  //     const data = await getDocs(usersQuery);
  //     setUsers(data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id })));
  //     // setGroup(data);
  //   };

  //   getGroup();
  //   // eslint-disable-next-line
  // }, []);

  const startOfDay = getTimeNow().startOf("day").toDate();
  const endOfDay = getTimeNow().endOf("day").toDate();

  const lessonsCollectionRef = collection(firestore, "lessons");
  const lessonsQuery = query(
    lessonsCollectionRef,
    where("group", "==", params.id),
    where("beginningTime", ">=", startOfDay),
    where("beginningTime", "<=", endOfDay),
    orderBy("beginningTime", "asc")
  );
  // const lessons = useFirestoreQuery(lessonsQuery);

  const [lessons, setLessons] = useState<DocumentData | null>([]);

  useEffect(
    () => {
      onSnapshot(lessonsQuery, (snapshot: any) => {
        const lessonsSnapshot = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setLessons(lessonsSnapshot);
      });
    },
    // eslint-disable-next-line
    []
  );

  return (
    <PrivateRoute>
      <Container className="mt-5">
        <div className="d-flex justify-content-center">
          <Avatar href={group?.avatarURL} height={150} size={250} />
        </div>
        <h1 className="text-white d-flex justify-content-center mt-3">
          {group?.name}
        </h1>
        <Schedule lessons={lessons} />
        <Alert variant="dark box mt-5">
          <h2 className="text-white">Students</h2>
          <Container className="d-grid gap-3 mt-5">
            {users?.map((user: any, index: number) => (
              <Button
                disabled={true}
                variant="secondary"
                key={user.id}
                className="user-btn"
              >
                <Row>
                  <Col xs={1} className="user-number">
                    <h4>{index + 1}.</h4>
                  </Col>
                  <Col xs={1} className="user-avatar">
                    <Avatar email={user.email} height={28} size={50} />
                  </Col>
                  <Col xs={12} sm={10} className="user-email">
                    <h4>{`${user.lastName} ${user.firstName}`}</h4>
                  </Col>
                </Row>
              </Button>
            ))}
          </Container>
        </Alert>
      </Container>
    </PrivateRoute>
  );
};

export default GroupPage;
