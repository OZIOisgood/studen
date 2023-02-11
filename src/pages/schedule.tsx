import { doc, DocumentData, getDoc } from "firebase/firestore";
import moment from "moment";
import { FC, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { GroupRoute, Lessons, Paper, PrivateRoute, Wrapper } from "../components";
import { FirebaseContext } from "../context/firebase";
import { checkUserIsGroupAdmin, getTimeNow, getUser } from "../utils";

import "../styles/pages/schedule.sass";

const SchedulePage: FC = (props) => {
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

  // check if User Is Group Admin
  let isAdmin = checkUserIsGroupAdmin(group, user);
  //

  return (
    <PrivateRoute>
      <GroupRoute groupUsers={group?.users} userID={user?.id}>
        <Wrapper
          showBackground
          className="pt-5 group-schedule-container"
        >
          <h1 className="text-white">
            <a href={`/groups/${params.id}`}>{group?.name}</a>
            <span className="text-muted">{" / "}</span> Schedule
          </h1>

          <Paper variant="mt-5">
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
                        moment(
                          new Date(timeCalendar.toDate().setDate(index + 1))
                        )
                      );
                      setTimeCalendarChoosenDay(index + 1);
                    }}
                  >
                    {index + 1}
                  </Button>
                ))}
              </Row>
            </Container>
          </Paper>

          <Lessons
            groupID={params.id}
            timeCalendar={timeCalendar}
            isAdmin={isAdmin}
          />
        </Wrapper>
      </GroupRoute>
    </PrivateRoute>
  );
};

export default SchedulePage;
