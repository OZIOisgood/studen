import { FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import {
  PrivateRoute,
  Avatar,
  Users,
  Schedule,
  Lessons,
  NavBar,
} from "../components";
import { FirebaseContext } from "../context/firebase";
import { getTimeNow, getUser, momentWeek, setUser } from "../utils";
import moment from "moment";
import * as ROUTES from "../constants/routes";

import "../styles/pages/schedule.sass";

const SimpleSchedulePage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

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
  const lessons = useFirestoreQuery(lessonsQuery);

  const coursesCollectionRef = collection(firestore, "courses");
  const coursesQuery = query(
    coursesCollectionRef,
    where("group", "==", params.id)
  );
  const courses = useFirestoreQuery(coursesQuery);

  // console.clear();
  console.log("\n\n````````````````` SimpleSchedulePage ````````````````````");
  // console.log(`timeCalendar: ${timeCalendar.format("DD/MM/YYYY")}`);

  return (
    <>
      <NavBar />

      <Container className="mt-5 group-simple-schedule-container">
        <div className="d-flex justify-content-center">
          <Avatar href={group?.avatarURL} height={150} size={250} />
        </div>

        <h1 className="text-white d-flex justify-content-center mt-3">
          {group?.name}
        </h1>

        <div className="d-flex justify-content-center mt-5">
          <Button
            variant="primary"
            size="lg"
            className="text-white fs-6"
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.host}${ROUTES.GROUPS}/${params.id}/demo`
              )
            }
          >
            <i className="fas fa-link"></i> <b>Demo link</b>
          </Button>
        </div>

        <Schedule courses={courses} lessons={lessons} />
      </Container>
    </>
  );
};

export default SimpleSchedulePage;
