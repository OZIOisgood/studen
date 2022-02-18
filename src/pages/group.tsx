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
  orderBy,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { PrivateRoute, GroupRoute, Avatar, Schedule } from "../components";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { getTimeNow, getUser } from "../utils";

import "../styles/pages/group.sass";

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
  const [showDeleteCourse, setShowDeleteCourse] = useState(false);
  const [showChangeCourse, setShowChangeCourse] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  const [courseName, setCourseName] = useState("");
  const [courseStaticLink, setCourseStaticLink] = useState("");

  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [groupBackground, setGroupBackground] = useState("");

  const [courseToDelete, setCourseToDelete] = useState(
    courses ? courses[0] : null
  );
  const [courseToChange, setCourseToChange] = useState(
    courses ? courses[0] : null
  );
  const [userToDelete, setUserToDelete] = useState(users ? users[0] : null);

  const handleCloseCreateCourse = () => setShowCreateCourse(false);
  const handleShowCreateCourse = () => setShowCreateCourse(true);

  const handleCloseDeleteCourse = () => setShowDeleteCourse(false);
  const handleShowDeleteCourse = () => setShowDeleteCourse(true);

  const handleCloseChangeCourse = () => setShowChangeCourse(false);
  const handleShowChangeCourse = () => setShowChangeCourse(true);

  const handleCloseDeleteUser = () => setShowDeleteUser(false);
  const handleShowDeleteUser = () => setShowDeleteUser(true);

  const handleCloseGroupSettings = () => setShowGroupSettings(false);
  const handleShowGroupSettings = () => setShowGroupSettings(true);

  const db = getFirestore();

  const handleChangeGroup = async () => {
    try {
      setShowGroupSettings(false);

      const newGroup = {
        name: groupName,
        avatarURL: groupAvatar,
        backgroundURL: groupBackground,
        // admins: group?.admins,
        // users: group?.users,
        // schedule: group?.schedule,
      };

      const changeDocRef = doc(db, "groups", `${params.id}`);
      await updateDoc(changeDocRef, newGroup);

      // console.log("^^^^ newGroup ^^^^");
      // console.log(newGroup.name);
      // console.log(newGroup.avatarURL);
      // console.log(newGroup.backgroundURL);
      // console.log(newGroup.admins);
      // console.log(newGroup.users);
      // console.log(newGroup.schedule);
      // console.log("^^^^ oldGroup ^^^^");
      // console.log(group?.name);
      // console.log(group?.avatarURL);
      // console.log(group?.backgroundURL);
      // console.log(group?.admins);
      // console.log(group?.users);
      // console.log(group?.schedule);
      // console.log("^^^^^^^^^^^^^^^^^^^");
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setCourseName("");
    }
  };

  const handleCreateCourse = async () => {
    try {
      setShowCreateCourse(false);

      await addDoc(collection(db, "courses"), {
        name: courseName,
        group: params.id,
        staticLink: courseStaticLink,
      });
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setCourseName("");
    }
  };

  const handleChangeCourse = async () => {
    try {
      setShowChangeCourse(false);

      const newCourse = {
        name: courseName,
        group: courseToChange.group,
        staticLink: courseStaticLink,
      };

      const changeDocRef = doc(db, "courses", courseToChange.id);
      await updateDoc(changeDocRef, newCourse);

      console.log("^^^^ newCourse ^^^^");
      // console.log(`id: ${newLessonRef.id}`);
      console.log(newCourse.name);
      console.log(newCourse.group);
      console.log(newCourse.staticLink);
      console.log("^^^^^^^^^^^^^^^^^^^");
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setCourseName("");
    }
  };

  const handleDeleteCourse = async (courseID: string) => {
    try {
      setShowDeleteCourse(false);

      const lessonsToDeleteCollectionRef = collection(firestore, "lessons");
      const lessonsToDeleteQuery = query(
        lessonsToDeleteCollectionRef,
        where("course", "==", courseID)
      );
      const lessonsToDeleteSnapshot = await getDocs(lessonsToDeleteQuery);
      const lessonsToDelete = lessonsToDeleteSnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));

      lessonsToDelete.forEach((lesson) => {
        deleteDoc(doc(db, "lessons", lesson.id));

        console.log(`$$$ Delete: lesson.id ${lesson.id} $$$`);
      });

      await deleteDoc(doc(db, "courses", courseID));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleDeleteUser = async (userIDToDelete: string) => {
    try {
      setShowDeleteUser(false);

      const newGroup = {
        admins: arrayRemove(userIDToDelete),
        users: arrayRemove(userIDToDelete),
      };

      const changeGroupDocRef = doc(db, "groups", `${params.id}`);
      await updateDoc(changeGroupDocRef, newGroup);

      const newUser = {
        groups: arrayRemove(`${params.id}`),
      };

      const changeUserDocRef = doc(db, "users", userIDToDelete);
      await updateDoc(changeUserDocRef, newUser);

      // console.log("^^^^ userToDelete ^^^^");
      // console.log(userIDToDelete);
      // console.log("^^^^ oldGroup ^^^^");
      // console.log(group?.admins);
      // console.log(group?.users);
      // console.log("^^^^ newGroup ^^^^");
      // console.log(newAdmins);
      // console.log(newUsers);
      // console.log("^^^^^^^^^^^^^^^^^^^");
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <PrivateRoute>
      <GroupRoute groupUsers={group?.users} userID={user?.id}>
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

          <div className="d-flex justify-content-center mt-5">
            <ButtonGroup>
              <Button
                variant="secondary"
                size="lg"
                className="text-white fs-6"
                onClick={() => {
                  handleShowGroupSettings();

                  setGroupName(group?.name);
                  setGroupAvatar(group?.avatarURL);
                  setGroupBackground(group?.backgroundURL);
                }}
              >
                <i className="fas fa-cog"></i> <b>Settings</b>
              </Button>
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

              <Modal
                show={showGroupSettings}
                onHide={handleCloseGroupSettings}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Group settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        defaultValue={group?.name}
                        type="text"
                        placeholder="Enter group name"
                        onChange={(event) => {
                          setGroupName(event.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Avatar <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        defaultValue={group?.avatarURL}
                        type="url"
                        placeholder="Enter url"
                        onChange={(event) => {
                          setGroupAvatar(event.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Background <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        defaultValue={group?.backgroundURL}
                        type="url"
                        placeholder="Enter url"
                        onChange={(event) => {
                          setGroupBackground(event.target.value);
                        }}
                      />
                    </Form.Group>

                    <div className="d-grid gap-2 mt-4">
                      <Button
                        variant="info"
                        className="text-white"
                        onClick={handleChangeGroup}
                      >
                        <b>Save changes</b>
                      </Button>
                      <Button
                        variant="danger"
                        className="text-white"
                        // onClick={() => {
                        //   handleDeleteLesson();
                        // }}
                      >
                        <b>Delete group</b>
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-white"
                        onClick={handleCloseGroupSettings}
                      >
                        <b>Cancel</b>
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </ButtonGroup>
          </div>

          <Schedule courses={courses} lessons={lessons} groupID={params.id} />

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
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Course name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          onChange={(event) => {
                            setCourseName(event.target.value);
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Static link</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter url"
                          onChange={(event) => {
                            setCourseStaticLink(event.target.value);
                          }}
                        />
                      </Form.Group>
                      <div className="d-grid gap-2">
                        <Button
                          variant="info"
                          className="text-white"
                          onClick={handleCreateCourse}
                        >
                          Create
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
                <Row key={`course-${course.id}`}>
                  <Col xs={9} md={10} className="d-grid">
                    <Button
                      disabled={true}
                      variant="secondary"
                      className="user-btn"
                    >
                      <Row>
                        <Col xs={1} className="course-number">
                          <h4 className="text-align-right">{index + 1}.</h4>
                        </Col>
                        <Col xs={11} className="course-name">
                          <h4 className="text-align-left">{course.name}</h4>
                        </Col>
                      </Row>
                    </Button>
                  </Col>
                  <Col xs={3} md={2} className="d-grid gap-3">
                    <ButtonGroup>
                      <Button
                        variant="secondary"
                        className="lesson-btn"
                        onClick={() => {
                          setCourseToChange(course);
                          handleShowChangeCourse();

                          setCourseName(course.name);
                          setCourseStaticLink(course.staticLink);
                        }}
                      >
                        <i className="fas fa-cog"></i>
                      </Button>
                      <Button
                        variant="danger"
                        className="lesson-btn"
                        onClick={() => {
                          setCourseToDelete(course);
                          handleShowDeleteCourse();
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              ))}

              <Modal
                show={showDeleteCourse}
                onHide={handleCloseDeleteCourse}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Deleting the course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Modal.Title className="fs-5 text-secondary">
                    {`Are you sure you want to delete ${courseToDelete?.name}?`}
                  </Modal.Title>
                  <Form>
                    <div className="d-grid mt-4">
                      <Button
                        variant="danger"
                        className="text-white"
                        onClick={() => {
                          console.log("^^^ Deleting the course ^^^");
                          console.log(`courseId: ${courseToDelete?.id}`);

                          handleDeleteCourse(courseToDelete?.id);
                        }}
                      >
                        <b>Delete course</b>
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>

              <Modal
                show={showChangeCourse}
                onHide={handleCloseChangeCourse}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Changing the course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Course name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        defaultValue={courseToChange?.name}
                        type="text"
                        placeholder="Enter name"
                        onChange={(event) => {
                          setCourseName(event.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Static link</Form.Label>
                      <Form.Control
                        defaultValue={courseToChange?.staticLink}
                        type="text"
                        placeholder="Enter url"
                        onChange={(event) => {
                          setCourseStaticLink(event.target.value);
                        }}
                      />
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button
                        variant="info"
                        className="text-white"
                        onClick={handleChangeCourse}
                      >
                        Change
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleCloseChangeCourse}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </Container>
          </Alert>

          <Alert variant="dark box mt-5">
            <h2 className="text-white">Students</h2>
            <Container className="d-grid gap-3 mt-5">
              {users?.map((item: any, index: number) => (
                <Row key={`student-${item.id}`}>
                  <Col xs={9} md={10} className="d-grid gap-3">
                    <Button
                      disabled={true}
                      variant="secondary"
                      className="user-btn"
                    >
                      <Row>
                        <Col xs={1} className="user-number">
                          <h4 className="text-align-right">{index + 1}.</h4>
                        </Col>
                        <Col xs={1} className="user-avatar text-align-left">
                          <Avatar email={item.email} height={28} size={50} />
                        </Col>
                        <Col
                          xs={10}
                          className="user-fullName p-3 pt-0 pr-0 pb-0"
                        >
                          <h4 className="text-align-left">{`${item.lastName} ${item.firstName}`}</h4>
                        </Col>
                      </Row>
                    </Button>
                  </Col>

                  <Col xs={3} md={2} className="d-grid gap-3">
                    <ButtonGroup>
                      <Button
                        disabled={true}
                        variant="secondary"
                        className="userAdmin-btn"
                      >
                        <i className="fas fa-user-shield"></i>
                      </Button>
                      <Button
                        variant="danger"
                        className="lesson-btn"
                        onClick={() => {
                          setUserToDelete(item);
                          handleShowDeleteUser();
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              ))}

              <Modal
                show={showDeleteUser}
                onHide={handleCloseDeleteUser}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Deleting the user from the group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Modal.Title className="fs-5 text-secondary">
                    {`Are you sure you want to delete ${userToDelete?.lastName} ${userToDelete?.firstName}?`}
                  </Modal.Title>
                  <Form>
                    <div className="d-grid mt-4">
                      <Button
                        variant="danger"
                        className="text-white"
                        onClick={() => {
                          console.log("^^^ Deleting the user ^^^");
                          console.log(`userId: ${userToDelete?.id}`);

                          handleDeleteUser(userToDelete?.id);
                        }}
                      >
                        <b>Delete user</b>
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </Container>
          </Alert>
        </Container>
      </GroupRoute>
    </PrivateRoute>
  );
};

export default GroupPage;
