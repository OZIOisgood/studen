import { FC, useContext } from "react";
import { Container } from "react-bootstrap";
import { FirebaseContext } from "../context/firebase";

import { Loader, NavBar } from "../components";
import { Navigate } from "react-router";
import * as ROUTES from "../constants/routes";

import "../styles/pages/starter.sass";

const StarterPage: FC = (props) => {
  const { user, initializing } = useContext(FirebaseContext);

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
              <h1 className="text-white">What is it?</h1>
              <h4 className="text-white mt-3">
                <b>STUDEN.</b> - a simple manager for study process.
              </h4>
            </Container>
          </div>

          <div className="screen screen-dark">
            <Container>
              <h1 className="text-white">Why should I use it?</h1>
              <h4 className="text-white mt-3">
                It is too simple to use… Did you heard it?! Yeah, simple! But
                despite this, it has a lot of functional.
              </h4>
            </Container>
          </div>

          <div className="screen">
            <Container>
              <h1 className="text-white">
                So what problems does it actually solves?
              </h1>
              <h4 className="text-white mt-3">
                In the era of distance education, we have problems of having a
                lot of conference links. Is it familiar to you? Yeah… Using
                STUDEN. you will forget about this pain in ass for EVER!
              </h4>
            </Container>
          </div>

          <div className="screen screen-dark">
            <Container>
              <h1 className="text-white">Who did this insane project?</h1>
              <h4 className="text-white mt-3">
                It is created by Lobarev Pavel, student of CS in KPI IASA.
              </h4>
            </Container>
          </div>

          <div className="screen">
            <Container>
              <h1 className="text-white">How you can help the project?</h1>
              <h4 className="text-white mt-3">
                Only thing you can do is – sharing site with your friends. But
                if you are a good Front end programmer, you can help me by
                developing this project together. Just find contacts on my{" "}
                <a href="https://github.com/OZIOisgood">GitHub page</a>.
              </h4>
            </Container>
          </div>
        </div>
      )}
    </>
  );
};

export default StarterPage;
