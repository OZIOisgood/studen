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
} from "react-bootstrap";
import moment from "moment";
import {
  collection,
  query,
  orderBy,
  where,
  getFirestore,
  getDocs,
  onSnapshot,
  DocumentData,
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { getPrettyTimeByStamp, momentWeek } from "../utils";
import { useParams } from "react-router";
import { FirebaseContext } from "../context/firebase";
import { ErrorModal } from "../components";

import "../styles/components/lessons.sass";

type LessonsProps = {
  groupID: string | undefined;
  timeCalendar: any;
};

export const Lessons: FC<LessonsProps> = ({ groupID, timeCalendar }) => {
  const { firestore } = useContext(FirebaseContext);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

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
  const [showChangeLesson, setShowChangeLesson] = useState(false);
  const [showDeleteLesson, setShowDeleteLesson] = useState(false);
  const [showCopyLastWeek, setShowCopyLastWeek] = useState(false);
  const [showCopyWeekBeforeLast, setShowCopyWeekBeforeLast] = useState(false);

  const [lessonToDelete, setLessonToDelete] = useState(lessons[0]);
  const [lessonToChange, setLessonToChange] = useState(lessons[0]);

  const handleCloseAddLesson = () => {
    setShowAddLesson(false);

    setUseLessonNumber(true);
    setUseStaticLink(false);
  };
  const handleShowAddLesson = () => setShowAddLesson(true);

  const handleCloseChangeLesson = () => {
    setShowChangeLesson(false);

    setUseLessonNumber(true);
    setUseStaticLink(false);
  };
  const handleShowChangeLesson = () => setShowChangeLesson(true);

  const handleCloseDeleteLesson = () => setShowDeleteLesson(false);
  const handleShowDeleteLesson = () => setShowDeleteLesson(true);

  const handleCloseCopyLastWeek = () => setShowCopyLastWeek(false);
  const handleShowCopyLastWeek = () => setShowCopyLastWeek(true);

  const handleCloseCopyWeekBeforeLast = () => setShowCopyWeekBeforeLast(false);
  const handleShowCopyWeekBeforeLast = () => setShowCopyWeekBeforeLast(true);

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

  const handleChangeLesson = async () => {
    try {
      setShowChangeLesson(false);

      // if (lessonName === "") throw new Error("You haven't entered group name.");
      // if (lessonName === "") throw new Error("You haven't entered group name.");
      // if (lessonBeginningTime === "")
      //   throw new Error("You haven't entered beginning time of lesson.");
      // if (lessonEndTime === "")
      //   throw new Error("You haven't entered end time of lesson.");

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
        beginningTime: beginningTimeTimestamp,
        endTime: endTimeTimestamp,
        conferenceLink: lessonConferenceLink,
      };

      const changeDocRef = doc(db, "lessons", lessonToChange.id);
      await updateDoc(changeDocRef, newLesson);

      // const newLessonRef = await addDoc(collection(db, "lessons"), newLesson);

      console.log("^^^^ newLesson ^^^^");
      // console.log(`id: ${newLessonRef.id}`);
      console.log(newLesson);
      console.log(lessonBeginningTime);
      console.log(lessonEndTime);
      console.log("^^^^^^^^^^^^^^^^^^^");
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLessonName("");
      setLessonBeginningTime("");
      setLessonEndTime("");
      setLessonConferenceLink("");

      setUseLessonNumber(true);
      setUseStaticLink(false);
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

      await addDoc(collection(db, "lessons"), newLesson);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLessonName("");
      setCourseIndex("0");
      setLessonBeginningTime("");
      setLessonEndTime("");
      setLessonConferenceLink("");

      setUseLessonNumber(true);
      setUseStaticLink(false);
    }
  };

  const handleCopyLastWeek = async () => {
    try {
      setShowCopyLastWeek(false);

      const { prevWeekBeginning, prevWeekEnd } = momentWeek(timeCalendar);

      const lessonsCollectionRef = collection(firestore, "lessons");
      const lessonsQuery = query(
        lessonsCollectionRef,
        where("group", "==", params.id),
        where("beginningTime", ">=", prevWeekBeginning.toDate()),
        where("beginningTime", "<=", prevWeekEnd.toDate()),
        orderBy("beginningTime", "asc")
      );

      const lessons = await getDocs(lessonsQuery).then((snapshot) => {
        return snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
      });

      await lessons.forEach(async (lesson) => {
        const newLessonBeginningTime = moment(
          new Date(lesson.beginningTime.seconds * 1000)
        );
        const newLessonEndTime = moment(
          new Date(lesson.endTime.seconds * 1000)
        );

        newLessonBeginningTime.add(1, "weeks");
        newLessonEndTime.add(1, "weeks");

        const newLesson = {
          name: lesson.name,
          group: lesson.group,
          course: lesson.course,
          beginningTime: newLessonBeginningTime.toDate(),
          endTime: newLessonEndTime.toDate(),
          conferenceLink: lesson.conferenceLink,
        };

        await addDoc(collection(db, "lessons"), newLesson);
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleCopyWeekBeforeLast = async () => {
    try {
      setShowCopyWeekBeforeLast(false);

      const { prevWeekBeginning, prevWeekEnd } = momentWeek(
        momentWeek(timeCalendar).prevWeekBeginning
      );

      const lessonsCollectionRef = collection(firestore, "lessons");
      const lessonsQuery = query(
        lessonsCollectionRef,
        where("group", "==", params.id),
        where("beginningTime", ">=", prevWeekBeginning.toDate()),
        where("beginningTime", "<=", prevWeekEnd.toDate()),
        orderBy("beginningTime", "asc")
      );

      const lessons = await getDocs(lessonsQuery).then((snapshot) => {
        return snapshot.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
      });

      await lessons.forEach(async (lesson) => {
        const newLessonBeginningTime = moment(
          new Date(lesson.beginningTime.seconds * 1000)
        );
        const newLessonEndTime = moment(
          new Date(lesson.endTime.seconds * 1000)
        );

        newLessonBeginningTime.add(2, "weeks");
        newLessonEndTime.add(1, "weeks");

        const newLesson = {
          name: lesson.name,
          group: lesson.group,
          course: lesson.course,
          beginningTime: newLessonBeginningTime.toDate(),
          endTime: newLessonEndTime.toDate(),
          conferenceLink: lesson.conferenceLink,
        };

        await addDoc(collection(db, "lessons"), newLesson);
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Alert variant="dark box mt-5 lessons-container">
      <Container className="d-grid gap-3">
        {lessons.length !== 0 ? (
          lessons?.map((item: any, index: number) => (
            <Row key={`lesson-${item.id}`}>
              <Col xs={2} md={1} className="d-grid gap-3">
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
              <Col xs={7} sm={7} md={9} className="d-grid gap-3">
                {" "}
                <Button
                  disabled={true}
                  variant="secondary"
                  className="lesson-btn"
                >
                  <Row>
                    <Col
                      xs={12}
                      md={5}
                      className="lesson-course-name text-align-left"
                    >
                      <h4>
                        {courses != null
                          ? courses.find(
                              (course: any) => course.id === item.course
                            )?.name
                          : null}
                      </h4>
                    </Col>
                    <Col xs={12} md={7} className="lesson-name text-align-left">
                      <h4>{item.name}</h4>
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col xs={3} md={2} className="d-grid gap-3">
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    key={`changeBtn-${item.id}`}
                    className="lesson-btn"
                    onClick={() => {
                      setUseLessonNumber(false);
                      setLessonToChange(item);
                      handleShowChangeLesson();

                      setLessonName(item.name);
                      setLessonBeginningTime(
                        getPrettyTimeByStamp(item.beginningTime)
                      );
                      setLessonEndTime(getPrettyTimeByStamp(item.endTime));
                      setLessonConferenceLink(item.conferenceLink);
                    }}
                  >
                    <i className="fas fa-cog"></i>
                  </Button>
                  <Button
                    variant="danger"
                    key={`deleteBtn-${item.id}`}
                    className="lesson-btn"
                    onClick={() => {
                      setLessonToDelete(item);
                      handleShowDeleteLesson();
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          ))
        ) : (
          <h2 className="text-white">No lessons this day</h2>
        )}

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
              {`Are you sure you want to delete ${
                courses != null
                  ? courses.find(
                      (course: any) => course.id === lessonToDelete?.course
                    )?.name
                  : null
              }: ${lessonToDelete?.name}?`}
            </Modal.Title>
            <Form>
              <div className="d-grid mt-4">
                <Button
                  variant="danger"
                  className="text-white"
                  onClick={() => {
                    console.log("^^^ Deleting the lesson ^^^");
                    console.log(`lessonId: ${lessonToDelete?.id}`);

                    handleDeleteLesson(lessonToDelete?.id);
                  }}
                >
                  <b>Delete lesson</b>
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Button
          size="lg"
          variant="info"
          className="text-white mt-2"
          onClick={handleShowAddLesson}
        >
          <b>
            <i className="far fa-calendar-plus"></i> Add new lesson
          </b>
        </Button>

        <Row>
          <Col xs={12} md={6} className="d-grid gap-2">
            <Button
              size="lg"
              variant="secondary"
              className="text-white mt-2"
              onClick={handleShowCopyLastWeek}
            >
              <i className="fas fa-angle-left"></i> <b>Copy last week</b>
            </Button>
          </Col>

          <Col xs={12} md={6} className="d-grid gap-2">
            <Button
              size="lg"
              variant="secondary"
              className="text-white mt-2"
              onClick={handleShowCopyWeekBeforeLast}
            >
              <i className="fas fa-angle-double-left"></i>{" "}
              <b>Copy week before last</b>
            </Button>
          </Col>
        </Row>

        <Modal
          show={showChangeLesson}
          onHide={handleCloseChangeLesson}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Changing new lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3 lesson-name">
                <Form.Label>
                  Lesson name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  // id="Control-lessonToChange.name"
                  defaultValue={lessonToChange?.name}
                  type="text"
                  placeholder="Enter name"
                  onChange={(event) => {
                    setLessonName(event.target.value);
                  }}
                />
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
                    <Form.Label>
                      Lesson number <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      onChange={(event) => {
                        const values = event.target.value.split("/");

                        setLessonBeginningTime(values[0]);
                        setLessonEndTime(values[1]);
                      }}
                    >
                      <option>Choose lesson number ...</option>
                      {group?.schedule?.map((item: any, index: number) => (
                        <option key={`add-${index}`} value={item}>
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
                        <Form.Label>
                          Lesson beginning{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          // id="Control-lessonToChange.beginningTime"
                          defaultValue={getPrettyTimeByStamp(
                            lessonToChange?.beginningTime
                          )}
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
                        <Form.Label>
                          Lesson end <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          // id="Control-lessonToChange.endTime"
                          defaultValue={getPrettyTimeByStamp(
                            lessonToChange?.endTime
                          )}
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
                          ? courses[Number(courseIndex)]?.staticLink === ""
                          : false
                      }
                      variant={useStaticLink ? "success" : "secondary"}
                      onClick={() => {
                        if (
                          courses != null
                            ? courses[Number(courseIndex)].staticLink
                            : false
                        ) {
                          setUseStaticLink(true);
                          setLessonConferenceLink(
                            courses != null
                              ? courses[Number(courseIndex)].staticLink
                              : ""
                          );
                        }
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
                      // id="Control-lessonToChange.conferenceLink"
                      defaultValue={lessonToChange?.conferenceLink}
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
                  onClick={handleChangeLesson}
                >
                  <b>Change lesson</b>
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showAddLesson} onHide={handleCloseAddLesson} centered>
          <Modal.Header closeButton>
            <Modal.Title>Adding new lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3 lesson-name">
                <Form.Label>
                  Lesson name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  onChange={(event) => {
                    setLessonName(event.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 lesson-course">
                <Form.Label>
                  Course <span className="text-danger">*</span>
                </Form.Label>
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
                    <Form.Label>
                      Lesson number <span className="text-danger">*</span>
                    </Form.Label>
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
                        <Form.Label>
                          Lesson beginning{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
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
                        <Form.Label>
                          Lesson end <span className="text-danger">*</span>
                        </Form.Label>
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
                          ? courses[Number(courseIndex)]?.staticLink === ""
                          : false
                      }
                      variant={useStaticLink ? "success" : "secondary"}
                      onClick={() => {
                        if (
                          courses != null
                            ? courses[Number(courseIndex)].staticLink
                            : false
                        ) {
                          setUseStaticLink(true);
                          setLessonConferenceLink(
                            courses != null
                              ? courses[Number(courseIndex)].staticLink
                              : ""
                          );
                        }
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

        <Modal
          show={showCopyLastWeek}
          onHide={handleCloseCopyLastWeek}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Copying last week</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Title className="fs-5 text-secondary">
              Are you sure you want to copy last week to this one?
            </Modal.Title>
            <Form>
              <div className="d-grid mt-4">
                <Button
                  variant="info"
                  className="text-white"
                  onClick={handleCopyLastWeek}
                >
                  <b>Copy last week</b>
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showCopyWeekBeforeLast}
          onHide={handleCloseCopyWeekBeforeLast}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Copying last week</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Modal.Title className="fs-5 text-secondary">
              Are you sure you want to copy week before last to this one?
            </Modal.Title>
            <Form>
              <div className="d-grid mt-4">
                <Button
                  variant="info"
                  className="text-white"
                  onClick={handleCopyWeekBeforeLast}
                >
                  <b>Copy week before last</b>
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
    </Alert>
  );
};
