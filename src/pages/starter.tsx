import { FC, useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router";
import { Footer, Loader, NavBar } from "../components";
import * as ROUTES from "../constants/routes";
import { FirebaseContext } from "../context/firebase";

import "../styles/pages/starter.sass";

const spacerobot = require("../assets/starterPage/spacerobot.png");
const spaceship = require("../assets/starterPage/spaceship.png");
const search = require("../assets/starterPage/search.png");
const spaceman = require("../assets/starterPage/spaceman.png");
const spacebase = require("../assets/starterPage/spacebase.png");

const StarterPage: FC = (props) => {
  const { user, initializing } = useContext(FirebaseContext);
  // const navigate = useNavigate();

  // // signOut
  // const signout = async () => {
  //   await signOut(auth);
  //   await localStorage.removeItem("authUser");
  //   await navigate("/");
  // };
  // //

  // if (getUser() == null && user != null) {
  //   signout();
  // }
  return (
    <>
      <NavBar />

      {user ? (
        <Navigate to={ROUTES.HOME} />
      ) : initializing ? (
        <Loader />
      ) : (
        <div className="starter-container">
          <div className="screen">
            <Container>
              <Row>
                <Col xs={8}>
                  <h1 className="text-white">What is it?</h1>
                  <h4 className="text-white mt-3">
                    <b>STUDEN.</b> - a simple manager for study process.
                  </h4>
                </Col>
                <Col xs={4}>
                  <img
                    src={spacerobot}
                    style={{
                      height: "auto",
                      width: "100%",
                    }}
                    alt="spacerobot"
                  />
                </Col>
              </Row>
            </Container>
          </div>

          <div className="screen screen-dark">
            <Container>
              <Row>
                <Col xs={4}>
                  <img
                    src={spaceship}
                    style={{ height: "auto", width: "100%" }}
                    alt="spaceship"
                  />
                </Col>
                <Col xs={8}>
                  <h1 className="text-white">Why should I use it?</h1>
                  <h4 className="text-white mt-3">
                    It is too simple to use… Did you heard it?! Yeah, simple!
                    But despite this, it has a lot of functional.
                  </h4>
                </Col>
              </Row>
            </Container>
          </div>

          <div className="screen">
            <Container>
              <Row>
                <Col xs={8}>
                  <h1 className="text-white">
                    So what problems does it actually solves?
                  </h1>
                  <h4 className="text-white mt-3">
                    In the era of distance education, we have problems of having
                    a lot of conference links. Is it familiar to you? Yeah…
                    Using STUDEN. you will forget about this pain in ass for
                    EVER!
                  </h4>
                </Col>
                <Col xs={4}>
                  <img
                    src={search}
                    style={{
                      height: "auto",
                      width: "100%",
                    }}
                    alt="search"
                  />
                </Col>
              </Row>
            </Container>
          </div>

          <div className="screen screen-dark">
            <Container>
              <Row>
                <Col xs={4}>
                  <img
                    src={spaceman}
                    style={{ height: "auto", width: "100%" }}
                    alt="spaceman"
                  />
                </Col>
                <Col xs={8}>
                  <h1 className="text-white">Who did this insane project?</h1>
                  <h4 className="text-white mt-3">
                    It is created by Lobarev Pavel, student of CS in KPI IASA.
                  </h4>
                </Col>
              </Row>
            </Container>
          </div>

          <div className="screen">
            <Container>
              <Row>
                <Col xs={8}>
                  <h1 className="text-white">How you can help the project?</h1>
                  <h4 className="text-white mt-3">
                    Only thing you can do is – sharing site with your friends.
                    But if you are a good Front end programmer, you can help me
                    by developing this project together. Just find contacts on
                    my <a href="https://github.com/OZIOisgood">GitHub page</a>.
                  </h4>
                </Col>
                <Col xs={4}>
                  <img
                    src={spacebase}
                    style={{ height: "auto", width: "100%" }}
                    alt="spacebase"
                  />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default StarterPage;
