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
import { PrivateRoute, Avatar, Users, Schedule, Lessons } from "../components";
import { FirebaseContext } from "../context/firebase";
import { getTimeNow, getUser, momentWeek, setUser } from "../utils";
import moment from "moment";

import "../styles/pages/schedule.sass";

const SchedulePage: FC = (props) => {
  console.clear();

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

  const timeNow = getTimeNow();
  const timeNowMonth = timeNow.format("MMMM YYYY");

  const [timeCalendar, setTimeCalendar] = useState<any>(getTimeNow());
  const [timeCalendarChoosenDay, setTimeCalendarChoosenDay] = useState<number>(
    Number(timeNow.format("DD"))
  );

  const timeNowDayNumber = Number(timeNow.format("DD"));

  const {
    prevWeekBeginning,
    prevWeekEnd,
    nextWeekBeginning,
    nextWeekEnd,
    weeksInMonth,
    daysInFirstWeek,
    daysInLastWeek,
  } = momentWeek(timeCalendar);

  let tempDayButton = 1;

  //   const [lessons, setLessons] = useState<any>([]);

  //   const dateChanged = () => {
  //   };

  //   const lessonsCollectionRef = collection(firestore, "lessons");
  //   const lessonsQuery = query(
  //     lessonsCollectionRef,
  //     where("group", "==", params.id),
  //     where("beginningTime", ">=", timeCalendar.startOf("day").toDate()),
  //     where("beginningTime", "<=", timeCalendar.endOf("day").toDate()),
  //     orderBy("beginningTime", "asc")
  //   );
  //   const lessons = useFirestoreQuery(lessonsQuery);

  console.log("````````````````` SchedulePage ````````````````````");
  console.log(`timeCalendar: ${timeCalendar.format("DD/MM/YYYY")}`);
  // console.log(timeNowDayNumber);

  return (
    <PrivateRoute>
      <Container className="mt-5 group-schedule-container">
        <h1 className="text-white">
          <a href={`/groups/${params.id}`}>{group?.name}</a>
          <span className="text-muted">{" / "}</span> Schedule
        </h1>

        <Alert variant="dark box mt-5 box">
          <Container>
            <Row className="mt-3">
              <Col xs={2} md={1} className="text-align-right">
                <Button
                  variant="secondary"
                  className="mt-1"
                  onClick={() => {
                    const timeCalendarPrevMonth = timeCalendar.toDate();

                    timeCalendarPrevMonth.setMonth(
                      timeCalendar.toDate().getMonth() - 1
                    );
                    timeCalendarPrevMonth.setDate(1);

                    setTimeCalendar(moment(new Date(timeCalendarPrevMonth)));
                    setTimeCalendarChoosenDay(1);
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                </Button>
              </Col>
              <Col xs={8} md={10}>
                <h2 className="text-white text-center">
                  {timeCalendar.format("MMMM Do YYYY")}
                </h2>
              </Col>
              <Col xs={2} md={1}>
                <Button
                  variant="secondary"
                  className="mt-1"
                  onClick={() => {
                    const timeCalendarPrevMonth = timeCalendar.toDate();

                    timeCalendarPrevMonth.setMonth(
                      timeCalendar.toDate().getMonth() + 1
                    );
                    timeCalendarPrevMonth.setDate(1);

                    setTimeCalendar(moment(new Date(timeCalendarPrevMonth)));
                    setTimeCalendarChoosenDay(1);
                  }}
                >
                  <i className="fas fa-arrow-right"></i>
                </Button>
              </Col>
            </Row>
            <Row className="mt-4">
              {/* {[...Array(weeksInMonth)].map((week, weekIndex) => (
                <Col
                  xs={12}
                  sm={{ span: 6, offset: 3 }}
                  style={{ border: "1px solid lightgray" }}
                  className="gap-3"
                >
                  {[...Array(7)].map((day, dayIndex) => (
                    <Button
                      key={dayIndex}
                      id={`day-${dayIndex}`}
                      variant={
                        timeCalendarChoosenDay === tempDayButton
                          ? "info"
                          : timeNowDayNumber === tempDayButton &&
                            timeNowMonth === timeCalendar.format("MMMM YYYY")
                          ? "danger"
                          : "secondary"
                      }
                      className="m-1 calendar-number rounded-circle text-white"
                      onClick={(event) => {
                        setTimeCalendar(
                          moment(
                            new Date(
                              timeCalendar
                                .toDate()
                                .setDate(
                                  (event.target as Element).id.split("-")[1]
                                )
                            )
                          )
                        );
                        setTimeCalendarChoosenDay(dayIndex + 1);
                      }}
                    >
                      {tempDayButton++}
                    </Button>
                  ))}
                </Col>
              ))} */}
              {[...Array(timeCalendar.daysInMonth())].map((item, index) => (
                <Button
                  key={index}
                  variant={
                    timeCalendarChoosenDay === index + 1
                      ? "info"
                      : timeNowDayNumber === index + 1 &&
                        timeNowMonth === timeCalendar.format("MMMM YYYY")
                      ? "danger"
                      : "secondary"
                  }
                  className="m-1 calendar-number rounded-circle text-white"
                  onClick={() => {
                    setTimeCalendar(
                      moment(new Date(timeCalendar.toDate().setDate(index + 1)))
                    );
                    setTimeCalendarChoosenDay(index + 1);
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </Row>
          </Container>
        </Alert>

        <Lessons groupID={params.id} timeCalendar={timeCalendar} />
      </Container>
    </PrivateRoute>
  );
};

export default SchedulePage;
