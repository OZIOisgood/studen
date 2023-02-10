import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  setDoc,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import {
  PrivateRoute,
  GroupRoute,
  Avatar,
  Schedule,
  Tasks,
  ErrorModal,
} from "../components";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { checkUserIsGroupAdmin, getTimeNow, getUser } from "../utils";
import { BsShieldShaded, BsShieldSlashFill } from "react-icons/bs";
import { storage } from "../firebase-config";
import { deleteObject, ref } from "firebase/storage";
import moment from "moment";
import { Wrapper } from "../components/Wrapper";
import { Paper } from "../components/Paper";

import "../styles/pages/group.sass";

const GroupPage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);
  const user = getUser();
  const params = useParams();
  const groupID = `${params.id}`;
  const navigate = useNavigate();

  // Error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };
  //

  // get group snapshot
  const [group, setGroup] = useState<DocumentData | undefined>({});

  const groupRef = doc(firestore, "groups", groupID);
  useEffect(() => {
    const getGroup = async () => {
      const data = await getDoc(groupRef);
      setGroup(data.data());
    };

    getGroup();
    // eslint-disable-next-line
  }, []);
  //

  // get group users collection
  const usersCollectionRef = collection(firestore, "users");
  const usersQuery = query(
    usersCollectionRef,
    where("groups", "array-contains", params.id)
  );
  const users = useFirestoreQuery(usersQuery);
  //

  // today time borders
  const startOfDay = getTimeNow().startOf("day").toDate();
  const endOfDay = getTimeNow().endOf("day").toDate();
  //

  // get group lessons for today
  const lessonsCollectionRef = collection(firestore, "lessons");
  const lessonsQuery = query(
    lessonsCollectionRef,
    where("group", "==", params.id),
    where("beginningTime", ">=", startOfDay),
    where("beginningTime", "<=", endOfDay),
    orderBy("beginningTime", "asc")
  );
  const lessons = useFirestoreQuery(lessonsQuery);
  //

  // get group homeworks
  const homeworksCollectionRef = collection(firestore, "homeworks");
  const homeworksQuery = query(
    homeworksCollectionRef,
    where("group", "==", params.id)
    // orderBy("deadlineTime", "asc")
  );
  const allHomeworks = useFirestoreQuery(homeworksQuery);
  //

  // get user done homeworks
  const doneHomeworksCollectionRef = collection(firestore, "doneHomeworks");
  const doneHomeworksQuery = query(
    doneHomeworksCollectionRef,
    where("user", "==", user.id)
    // orderBy("deadlineTime", "asc")
  );
  const doneHomeworks = useFirestoreQuery(doneHomeworksQuery);
  //

  // get group course collection
  const coursesCollectionRef = collection(firestore, "courses");
  const coursesQuery = query(
    coursesCollectionRef,
    where("group", "==", params.id)
  );
  const courses = useFirestoreQuery(coursesQuery);
  //

  // state
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
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
  const [groupUTCOffset, setGroupUTCOffset] = useState("");

  const [courseToDelete, setCourseToDelete] = useState(
    courses ? courses[0] : null
  );
  const [courseToChange, setCourseToChange] = useState(
    courses ? courses[0] : null
  );
  const [userToDelete, setUserToDelete] = useState(users ? users[0] : null);
  //

  // handle Show and Close
  const handleCloseDeleteGroup = () => setShowDeleteGroup(false);
  const handleShowDeleteGroup = () => setShowDeleteGroup(true);

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
  //

  // getFirestore
  const db = getFirestore();
  //

  // changeGroup
  const handleChangeGroup = async () => {
    try {
      setShowGroupSettings(false);

      if (groupName === "") throw new Error("You haven't entered group name.");
      if (groupAvatar === "")
        throw new Error("You haven't entered group avatar link.");
      if (groupBackground === "")
        throw new Error("You haven't entered group background link.");
      if (groupUTCOffset === "")
        throw new Error("You haven't entered UTC offset.");

      const regexUTCOffset = /^[+-]{1}([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!regexUTCOffset.test(groupUTCOffset))
        throw new Error(
          'You entered incorrect UTC offset.\nPlese enter it in format "+00:00" or "-00:00".'
        );

      const newGroup = {
        name: groupName,
        avatarURL: groupAvatar,
        backgroundURL: groupBackground,
        UTCOffset: groupUTCOffset,
      };

      const changeDocRef = doc(db, "groups", groupID);
      await updateDoc(changeDocRef, newGroup);

      setGroup({
        ...group,
        name: groupName,
        avatarURL: groupAvatar,
        backgroundURL: groupBackground,
        UTCOffset: groupUTCOffset,
      });
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setGroupName("");
      setGroupAvatar("");
      setGroupBackground("");
      setGroupUTCOffset("");
    }
  };
  //

  // deleteGroup
  const handleDeleteGroup = async () => {
    try {
      setShowDeleteGroup(false);

      navigate("/home");

      const coursesToDeleteCollectionRef = collection(firestore, "courses");
      const coursesToDeleteQuery = query(
        coursesToDeleteCollectionRef,
        where("group", "==", groupID)
      );
      const coursesToDeleteSnapshot = await getDocs(coursesToDeleteQuery);
      const coursesToDelete = coursesToDeleteSnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));

      coursesToDelete.forEach((course) => {
        (async () => {
          const lessonsToDeleteCollectionRef = collection(firestore, "lessons");
          const lessonsToDeleteQuery = query(
            lessonsToDeleteCollectionRef,
            where("course", "==", course.id)
          );
          const lessonsToDeleteSnapshot = await getDocs(lessonsToDeleteQuery);
          const lessonsToDelete = lessonsToDeleteSnapshot.docs.map(
            (doc: any) => ({
              ...doc.data(),
              id: doc.id,
            })
          );

          lessonsToDelete.forEach((lesson) => {
            // delete lesson
            deleteDoc(doc(db, "lessons", lesson.id));
          });
        })();

        // delete course
        deleteDoc(doc(db, "courses", course.id));
      });

      const answersToDeleteCollectionRef = collection(
        firestore,
        "doneHomeworks"
      );
      const answersToDeleteQuery = query(
        answersToDeleteCollectionRef,
        where("group", "==", groupID)
      );
      const answersToDeleteSnapshot = await getDocs(answersToDeleteQuery);
      const answersToDelete = answersToDeleteSnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));

      answersToDelete.forEach((answer) => {
        if (answer.file.ref !== "") {
          const fileRef = ref(storage, answer.file.ref);

          // delete answer file
          deleteObject(fileRef);
        }

        // delete answer
        deleteDoc(doc(db, "doneHomeworks", answer.id));
      });

      const tasksToDeleteCollectionRef = collection(firestore, "homeworks");
      const tasksToDeleteQuery = query(
        tasksToDeleteCollectionRef,
        where("group", "==", groupID)
      );
      const tasksToDeleteSnapshot = await getDocs(tasksToDeleteQuery);
      const tasksToDelete = tasksToDeleteSnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));

      tasksToDelete.forEach((task) => {
        if (task.file.ref !== "") {
          const fileRef = ref(storage, task.file.ref);

          // delete task file
          deleteObject(fileRef);
        }

        // delete task
        deleteDoc(doc(db, "homeworks", task.id));
      });

      const usersToChangeCollectionRef = collection(firestore, "users");
      const usersToChangeQuery = query(
        usersToChangeCollectionRef,
        where("groups", "array-contains", groupID)
      );
      const usersToChangeSnapshot = await getDocs(usersToChangeQuery);
      const usersToChange = usersToChangeSnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const newUser = {
        groups: arrayRemove(groupID),
      };

      usersToChange.forEach((user) => {
        const usersToChangeDocRef = doc(db, "users", user.id);

        // change user
        updateDoc(usersToChangeDocRef, newUser);
      });

      // delete group
      deleteDoc(doc(db, "groups", groupID));
    } catch (error: any) {
      handleShowErrorModal(error.message);
    }
  };
  //

  // createCourse
  const handleCreateCourse = async () => {
    try {
      setShowCreateCourse(false);

      if (courseName === "")
        throw new Error("You haven't entered course name.");

      await addDoc(collection(db, "courses"), {
        name: courseName,
        group: params.id,
        staticLink: courseStaticLink,
      });
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setCourseName("");
      setCourseStaticLink("");
    }
  };
  //

  // changeCourse
  const handleChangeCourse = async () => {
    try {
      setShowChangeCourse(false);

      if (courseName === "")
        throw new Error("You haven't entered course name.");

      const newCourse = {
        name: courseName,
        group: courseToChange.group,
        staticLink: courseStaticLink,
      };

      const changeDocRef = doc(db, "courses", courseToChange.id);
      await updateDoc(changeDocRef, newCourse);
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setCourseName("");
      setCourseStaticLink("");
    }
  };
  //

  //deleteCourse
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
      });

      await deleteDoc(doc(db, "courses", courseID));
    } catch (error: any) {
      handleShowErrorModal(error.message);
    }
  };
  //

  // deleteUser
  const handleDeleteUser = async (userIDToDelete: string) => {
    try {
      setShowDeleteUser(false);

      const newGroup = {
        admins: arrayRemove(userIDToDelete),
        users: arrayRemove(userIDToDelete),
      };

      const changeGroupDocRef = doc(db, "groups", groupID);
      await updateDoc(changeGroupDocRef, newGroup);

      const newUser = {
        groups: arrayRemove(groupID),
      };

      const changeUserDocRef = doc(db, "users", userIDToDelete);
      await updateDoc(changeUserDocRef, newUser);
    } catch (error: any) {
      handleShowErrorModal(error.message);
    }
  };
  //

  // toggleAdmin
  const [userToggleAdmin, setUserToggleAdmin] = useState("");

  const handleToggleAdmin = async (userIDToggleAdmin: string) => {
    try {
      const groupDoc = await getDoc(doc(db, "groups", groupID));

      let newGroup = {};
      if (!groupDoc.data()?.admins.includes(userIDToggleAdmin)) {
        newGroup = {
          ...groupDoc.data(),
          admins: [...groupDoc.data()?.admins, userIDToggleAdmin],
        };
      } else {
        newGroup = {
          ...groupDoc.data(),
          admins: groupDoc
            .data()
            ?.admins.filter((adminID: string) => adminID !== userIDToggleAdmin),
        };
      }

      setGroup(newGroup);

      await setDoc(doc(db, "groups", groupID), newGroup);
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setUserToggleAdmin("");
    }
  };
  //

  // check if User Is Group Admin
  let isAdmin = checkUserIsGroupAdmin(group, user);
  //

  // console.log("############");
  // console.log("user: ");
  // console.log(user);
  // console.log("############");

  return (
    <PrivateRoute>
      <GroupRoute groupUsers={group?.users} userID={user?.id}>
        <Wrapper
          showBackground
          className="pt-5"
        >
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
              {isAdmin ? (
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-white fs-6"
                  onClick={() => {
                    handleShowGroupSettings();

                    setGroupName(group?.name);
                    setGroupAvatar(group?.avatarURL);
                    setGroupBackground(group?.backgroundURL);
                    setGroupUTCOffset(group?.UTCOffset);
                  }}
                >
                  <i className="fas fa-cog"></i> <b>Settings</b>
                </Button>
              ) : null}
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
                        onChange={(event: any) => {
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
                        onChange={(event: any) => {
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
                        onChange={(event: any) => {
                          setGroupBackground(event.target.value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        UTC offset <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        defaultValue={group?.UTCOffset}
                        type="url"
                        placeholder='Enter UTC offset in format "+00:00"'
                        onChange={(event: any) => {
                          setGroupUTCOffset(event.target.value);
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
                        onClick={() => {
                          setShowGroupSettings(false);
                          handleShowDeleteGroup();
                        }}
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

              <Modal
                show={showDeleteGroup}
                onHide={handleCloseDeleteGroup}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Deleting the group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Modal.Title className="fs-5 text-secondary">
                    {`Are you sure you want to delete ${group?.name}?`}
                  </Modal.Title>
                  <Form>
                    <div className="d-grid mt-4">
                      <Button
                        variant="danger"
                        className="text-white"
                        onClick={() => {
                          handleDeleteGroup();
                        }}
                      >
                        <b>Delete group</b>
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            </ButtonGroup>
          </div>

          <Schedule courses={courses} lessons={lessons} groupID={params.id} />

          <Tasks
            courses={courses}
            allTasks={allHomeworks}
            doneTasks={doneHomeworks}
            groupID={params.id}
          />

          <Paper variant="mt-5">
            <Row>
              <Col xs={9}>
                <h2 className="text-white">Group courses</h2>
              </Col>
              {isAdmin ? (
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
                            onChange={(event: any) => {
                              setCourseName(event.target.value);
                            }}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Static link</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter url"
                            onChange={(event: any) => {
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
              ) : null}
            </Row>
            <Container className="d-grid gap-3 mt-5">
              {courses?.map((course: any, index: number) => (
                <Row key={`course-${course.id}`}>
                  <Col
                    xs={isAdmin ? 9 : 12}
                    md={isAdmin ? 10 : 12}
                    className="d-grid"
                  >
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
                  {isAdmin ? (
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
                  ) : null}
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
                        onChange={(event: any) => {
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
                        onChange={(event: any) => {
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
          </Paper>

          <Paper variant="mt-5">
            <h2 className="text-white">Students</h2>
            <Container className="d-grid gap-3 mt-5">
              {users?.map((item: any, index: number) => (
                <Row key={`student-${item.id}`}>
                  <Col
                    xs={isAdmin ? 9 : 12}
                    md={isAdmin ? 10 : 12}
                    className="d-grid gap-3"
                  >
                    <Button
                      // disabled={true}
                      variant="secondary"
                      className="user-btn"
                      href={`/profile/${item.id}`}
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

                  {isAdmin ? (
                    <Col xs={3} md={2} className="d-grid gap-3 text-white">
                      <ButtonGroup>
                        <Button
                          disabled={item.id === user.id}
                          variant={
                            group?.admins.find(
                              (adminID: any) => adminID === item.id
                            )
                              ? "warning"
                              : "primary"
                          }
                          className="userAdmin-btn"
                          onClick={() => {
                            handleToggleAdmin(item.id);
                          }}
                        >
                          {group?.admins.find(
                            (adminID: any) => adminID === item.id
                          ) ? (
                            <BsShieldSlashFill />
                          ) : (
                            <BsShieldShaded />
                          )}
                        </Button>
                        <Button
                          disabled={item.id === user.id}
                          variant="danger"
                          className="delete-user-btn"
                          onClick={() => {
                            setUserToDelete(item);
                            handleShowDeleteUser();
                          }}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </Button>
                      </ButtonGroup>
                    </Col>
                  ) : null}
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

              <ErrorModal
                modalTitle="Error detected"
                buttonTitle="Try again"
                showErrorModal={showErrorModal}
                handleCloseErrorModal={handleCloseErrorModal}
                errorMessage={errorMessage}
              />
            </Container>
          </Paper>
        </Wrapper>
      </GroupRoute>
    </PrivateRoute>
  );
};

export default GroupPage;
