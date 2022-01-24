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
import { PrivateRoute, Avatar, Users, Schedule } from "../components";
import { FirebaseContext } from "../context/firebase";

import "../styles/pages/group.sass";
import { getTimeNow, getUser, setUser } from "../utils";

const GroupPage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

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

  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(
    usersCollectionRef,
    where("groups", "array-contains", params.id)
  );
  const users = useFirestoreQuery(usersQuery);

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

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [courseName, setCourseName] = useState("");

  const handleCloseCreateCourse = () => setShowCreateCourse(false);
  const handleShowCreateCourse = () => setShowCreateCourse(true);

  const db = getFirestore();

  const handleCreateCourse = async () => {
    try {
      const courseRef = await addDoc(collection(db, "courses"), {
        name: courseName,
        group: params.id,
      });
      let groupDoc = await getDoc(doc(db, "groups", `${params.id}`));

      await setDoc(doc(db, "groups", `${params.id}`), {
        ...groupDoc.data(),
        courses: [...groupDoc.data()?.courses, courseRef.id],
      });

      let userDoc = await getDoc(doc(db, "users", user.id));

      await setDoc(doc(db, "users", user.id), {
        ...userDoc.data(),
        courses: [...userDoc.data()?.courses, courseRef.id],
      });

      userDoc = await getDoc(doc(db, "users", user.id));

      setUser(
        JSON.stringify({
          ...userDoc.data(),
          id: userDoc.id,
        })
      );
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setShowCreateCourse(false);

      setCourseName("");
    }
  };

  return (
    <PrivateRoute>
      <Container className="mt-5">
        <div className="d-flex justify-content-center">
          <Avatar href={group?.avatarURL} height={150} size={250} />
        </div>
        <h1 className="text-white d-flex justify-content-center mt-3">
          {group?.name}
        </h1>
        <h4 className="text-muted d-flex justify-content-center mt-1 fs-5">
          {params.id}
        </h4>
        <Schedule lessons={lessons} groupID={params.id} />

        <Alert variant="dark box mt-5">
          <Row>
            <Col xs={9}>
              <h2 className="text-white">Group courses</h2>
            </Col>
            <Col xs={3} className="d-grid">
              <Button
                variant="info"
                size="sm"
                className="text-white fs-6"
                onClick={handleShowCreateCourse}
              >
                <b>Create Course</b>
              </Button>

              <Modal
                show={showCreateCourse}
                onHide={handleCloseCreateCourse}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Creating new course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="formGroupName">
                      <Form.Label>Course name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        onChange={(event) => {
                          setCourseName(event.target.value);
                        }}
                      />
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button
                        variant="info"
                        className="text-white"
                        onClick={handleCreateCourse}
                      >
                        Join
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleCloseCreateCourse}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
          <Container className="d-grid gap-3 mt-5">
            {courses?.map((course: any, index: number) => (
              <Button
                disabled={true}
                variant="secondary"
                key={course.id}
                className="user-btn"
              >
                <Row>
                  <Col xs={1} className="user-number">
                    <h4 className="text-align-right">{index + 1}.</h4>
                  </Col>
                  <Col xs={11} className="user-fullName">
                    <h4 className="text-align-left">{course.name}</h4>
                  </Col>
                </Row>
              </Button>
            ))}
          </Container>
        </Alert>

        <Users title="Students" users={users} />
      </Container>
    </PrivateRoute>
  );
};

export default GroupPage;
