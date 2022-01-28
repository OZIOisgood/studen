import { FC, useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Alert,
  ButtonGroup,
  Row,
  Col,
  Form,
  Modal,
  ToggleButton,
} from "react-bootstrap";
import moment from "moment";
import { firestore } from "../firebase-config";
import {
  collection,
  query,
  orderBy,
  where,
  CollectionReference,
  getFirestore,
  getDocs,
  onSnapshot,
  DocumentData,
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import {
  getPrettyTimeByStamp,
  getTimeNow,
  usePageReloadInterval,
} from "../utils";

import "../styles/components/lessons.sass";
import { useParams } from "react-router";
import { FirebaseContext } from "../context/firebase";

type LessonsProps = {
  groupID: string | undefined;
  timeCalendar: any;
};

export const Lessons: FC<LessonsProps> = ({ groupID, timeCalendar }) => {
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

  const [lessons, setLessons] = useState<any>([]);
  const [timeCalendarSaved, setTimeCalendarSaved] = useState<any>(timeCalendar);
  const [timeCalendarChanged, setTimeCalendarChanged] = useState<boolean>(true);

  if (timeCalendarSaved !== timeCalendar) {
    setTimeCalendarSaved(timeCalendar);
    setTimeCalendarChanged(true);
  }

  const lessonsCollectionRef = collection(firestore, "lessons");
  const lessonsQuery = query(
    lessonsCollectionRef,
    where("group", "==", groupID),
    where("beginningTime", ">=", timeCalendar.startOf("day").toDate()),
    where("beginningTime", "<=", timeCalendar.endOf("day").toDate()),
    orderBy("beginningTime", "asc")
  );
  // const lessons = useFirestoreQuery(lessonsQuery);

  if (timeCalendarChanged)
    onSnapshot(lessonsQuery, (snapshot: any) => {
      setLessons(
        snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }))
      );
      setTimeCalendarChanged(false);
    });

  const coursesCollectionRef = collection(firestore, "courses");
  const coursesQuery = query(
    coursesCollectionRef,
    where("group", "==", params.id)
  );
  const courses = useFirestoreQuery(coursesQuery);

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showDeleteLesson, setShowDeleteLesson] = useState(false);

  const handleCloseAddLesson = () => setShowAddLesson(false);
  const handleShowAddLesson = () => setShowAddLesson(true);

  const handleCloseDeleteLesson = () => setShowDeleteLesson(false);
  const handleShowDeleteLesson = () => setShowDeleteLesson(true);

  const [lessonName, setLessonName] = useState("");
  const [courseIndex, setCourseIndex] = useState("0");
  const [useLessonNumber, setUseLessonNumber] = useState(true);
  const [lessonBeginningTime, setLessonBeginningTime] = useState("");
  const [lessonEndTime, setLessonEndTime] = useState("");
  const [lessonConferenceLink, setLessonConferenceLink] = useState("");
  const [useStaticLink, setUseStaticLink] = useState(false);

  const db = getFirestore();

  const handleDeleteLesson = async (lessonID: string) => {
    try {
      setShowDeleteLesson(false);

      await deleteDoc(doc(db, "lessons", lessonID));
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleAddLesson = async () => {
    try {
      setShowAddLesson(false);

      const beginningTimeTimestamp = Timestamp.fromDate(
        moment(
          `${timeCalendar.format("YYYY-MM-DD")} ${lessonBeginningTime}`
        ).toDate()
      );
      const endTimeTimestamp = Timestamp.fromDate(
        moment(`${timeCalendar.format("YYYY-MM-DD")} ${lessonEndTime}`).toDate()
      );

      const newLesson = {
        name: lessonName,
        group: params.id,
        course: courses != null ? courses[Number(courseIndex)].id : "",
        beginningTime: beginningTimeTimestamp,
        endTime: endTimeTimestamp,
        conferenceLink: lessonConferenceLink,
      };

      const newLessonRef = await addDoc(collection(db, "lessons"), newLesson);

      console.log("^^^^ newLesson ^^^^");
      console.log(`id: ${newLessonRef.id}`);
      console.log(newLesson);
      console.log(lessonBeginningTime);
      console.log(lessonEndTime);
      console.log("^^^^^^^^^^^^^^^^^^^");
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLessonName("");
      setCourseIndex("0");
      setLessonBeginningTime("");
      setLessonEndTime("");
      setLessonConferenceLink("");
    }
  };

  // console.log("\n\n\n\n\n\n\n\n!!!!!!!!!!!!!! Lessons !!!!!!!!!!!!!!");
  // console.log(useLessonNumber);

  return (
    <Alert variant="dark box mt-5 lessons-container">
      <Container className="d-grid gap-3">
        {lessons.length !== 0 ? (
          lessons?.map((item: any, index: number) => (
            <Row key={item.id}>
              <Col xs={2} sm={1} md={1} className="d-grid gap-3">
                <Row>
                  <Col xs={12} className="lesson-time">
                    <span className="text-muted">
                      {getPrettyTimeByStamp(item.beginningTime)}
                    </span>
                  </Col>
                  <Col xs={12} className="lesson-time">
                    <span className="text-muted lesson-time">
                      {getPrettyTimeByStamp(item.endTime)}
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col xs={8} sm={9} md={10} className="d-grid gap-3">
                <Button
                  disabled={true}
                  variant="secondary"
                  className="lesson-btn"
                >
                  <h4 className="text-align-left">{item.name}</h4>
                </Button>
              </Col>
              <Col xs={2} sm={2} md={1} className="d-grid gap-3">
                <Button
                  variant="danger"
                  key={item.id}
                  className="lesson-btn"
                  onClick={handleShowDeleteLesson}
                >
                  <i className="fas fa-trash-alt"></i>
                </Button>
                <Modal
                  show={showDeleteLesson}
                  onHide={handleCloseDeleteLesson}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Deleting the lesson</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Modal.Title className="fs-5 text-secondary">
                      Are you sure you want to delete the lesson?
                    </Modal.Title>
                    <Form>
                      <div className="d-grid mt-4">
                        <Button
                          variant="danger"
                          className="text-white"
                          onClick={() => {
                            handleDeleteLesson(item.id);
                          }}
                        >
                          <b>Delete lesson</b>
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>
              </Col>
            </Row>
          ))
        ) : (
          <h2 className="text-white">No lessons this day</h2>
        )}
        <Button
          size="lg"
          variant="info"
          className="text-white mt-2"
          onClick={handleShowAddLesson}
        >
          <b>Add new lesson</b>
        </Button>
        <Modal show={showAddLesson} onHide={handleCloseAddLesson} centered>
          <Modal.Header closeButton>
            <Modal.Title>Adding new lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3 lesson-name">
                <Form.Label>Lesson name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  onChange={(event) => {
                    setLessonName(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 lesson-course">
                <Form.Label>Course</Form.Label>
                <Form.Select
                  onChange={(event) => {
                    setCourseIndex(event.target.value);
                    setUseStaticLink(false);
                    setLessonConferenceLink("");
                  }}
                >
                  <option>Choose course ...</option>
                  {courses?.map((item: any, index: number) => (
                    <option key={index} value={index}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="lesson-time mt-5">
                <div className="d-grid">
                  <ButtonGroup>
                    <Button
                      variant={useLessonNumber ? "success" : "secondary"}
                      onClick={() => {
                        setUseLessonNumber(true);
                      }}
                    >
                      Lesson number
                    </Button>
                    <Button
                      variant={!useLessonNumber ? "success" : "secondary"}
                      onClick={() => {
                        setUseLessonNumber(false);
                      }}
                    >
                      Choose time
                    </Button>
                  </ButtonGroup>
                </div>

                {useLessonNumber ? (
                  <Form.Group className="mt-3 mb-3">
                    <Form.Label>Lesson number</Form.Label>
                    <Form.Select
                      onChange={(event) => {
                        const values = event.target.value.split("/");

                        setLessonBeginningTime(values[0]);
                        setLessonEndTime(values[1]);
                      }}
                    >
                      <option>Choose lesson number ...</option>
                      {group?.schedule?.map((item: any, index: number) => (
                        <option key={index} value={item}>
                          {`${index + 1}. ${item.split("/")[0]} - ${
                            item.split("/")[1]
                          }`}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ) : (
                  <Row className="mt-3">
                    <Col xs={6}>
                      <Form.Group className="mb-3" controlId="formGroupName">
                        <Form.Label>Lesson beginning</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder='Time format "00:00"'
                          onChange={(event) => {
                            setLessonBeginningTime(event.target.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-3" controlId="formGroupName">
                        <Form.Label>Lesson end</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder='Time format "00:00"'
                          onChange={(event) => {
                            setLessonEndTime(event.target.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </div>

              <div className="lesson-conferenceLink mt-5">
                <div className="d-grid">
                  <ButtonGroup>
                    <Button
                      variant={!useStaticLink ? "success" : "secondary"}
                      onClick={() => {
                        setUseStaticLink(false);
                      }}
                    >
                      New link
                    </Button>
                    <Button
                      disabled={
                        courses != null
                          ? courses[Number(courseIndex)]?.staticLink == null
                          : true
                      }
                      variant={useStaticLink ? "success" : "secondary"}
                      onClick={() => {
                        if (
                          courses != null
                            ? courses[Number(courseIndex)].staticLink
                            : false
                        )
                          setUseStaticLink(true);
                      }}
                    >
                      Use static link
                    </Button>
                  </ButtonGroup>
                </div>

                <Form.Group className="mt-3">
                  <Form.Label>Lesson conference link</Form.Label>
                  {!useStaticLink ? (
                    <Form.Control
                      type="text"
                      placeholder="Enter url"
                      onChange={(event) => {
                        setLessonConferenceLink(event.target.value);
                      }}
                    />
                  ) : (
                    <Alert variant="secondary">
                      {courses != null
                        ? courses[Number(courseIndex)].staticLink
                        : ""}
                    </Alert>
                  )}
                </Form.Group>
              </div>

              <div className="d-grid mt-5">
                <Button
                  variant="info"
                  className="text-white"
                  onClick={handleAddLesson}
                >
                  <b>Add lesson</b>
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Alert>
  );
};
