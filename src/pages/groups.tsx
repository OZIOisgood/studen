import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import moment from "moment";
import { FC, useContext, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col, Form,
  Modal,
  Row
} from "react-bootstrap";
import { ErrorModal, Groups, PrivateRoute, Wrapper } from "../components";
import { FirebaseContext } from "../context/firebase";
import { useFirestoreQuery } from "../hooks";
import { getUser, setUser } from "../utils";

const GroupsPage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

  const user = getUser();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const myGroupsCollectionRef = collection(firestore, "groups");
  const myGroupsQuery = query(
    myGroupsCollectionRef,
    where("users", "array-contains", user.id)
  );
  const myGroups = useFirestoreQuery(myGroupsQuery);

  const [showJoin, setShowJoin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [groupID, setGroupID] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");
  const [groupBackground, setGroupBackground] = useState("");

  const handleCloseJoin = () => setShowJoin(false);
  const handleShowJoin = () => setShowJoin(true);

  const handleCloseCreate = () => setShowCreate(false);
  const handleShowCreate = () => setShowCreate(true);

  const db = getFirestore();

  const handleJoin = async () => {
    try {
      setShowJoin(false);

      const groupDoc = await getDoc(doc(db, "groups", groupID));

      if (typeof groupDoc.data() === "undefined")
        throw new Error("There is no group with such id");

      await setDoc(doc(db, "groups", groupID), {
        ...groupDoc.data(),
        users: [...groupDoc.data()?.users, user.id],
      });

      let userDoc = await getDoc(doc(db, "users", user.id));

      await updateDoc(doc(db, "users", user.id), {
        groups: arrayUnion(groupID),
      });

      userDoc = await getDoc(doc(db, "users", user.id));

      setUser(
        JSON.stringify({
          ...userDoc.data(),
          id: userDoc.id,
        })
      );
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setGroupID("");
    }
  };

  const handleCreate = async () => {
    try {
      setShowCreate(false);

      if (groupName === "") throw new Error("You haven't entered group name.");
      if (groupAvatar === "")
        throw new Error("You haven't entered group avatar link.");
      if (groupBackground === "")
        throw new Error("You haven't entered group background link.");

      const groupRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        avatarURL: groupAvatar,
        backgroundURL: groupBackground,
        admins: [user.id],
        users: [user.id],
        schedule: [
          "08:30/10:05",
          "10:25/12:00",
          "12:20/13:55",
          "14:15/15:50",
          "16:10/17:45",
          "18:30/20:05",
          "20:20/21:55",
        ],
        UTCOffset: moment().format("Z"),
      });

      let userDoc = await getDoc(doc(db, "users", user.id));

      await updateDoc(doc(db, "users", user.id), {
        groups: arrayUnion(groupRef.id),
      });

      userDoc = await getDoc(doc(db, "users", user.id));

      setUser(
        JSON.stringify({
          ...userDoc.data(),
          id: userDoc.id,
        })
      );
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setGroupName("");
      setGroupAvatar("");
      setGroupBackground("");
    }
  };

  return (
    <PrivateRoute>
      <Wrapper className="pt-5">
        <Row>
          <Col xs={6}>
            <h1 className="text-white">Groups</h1>
          </Col>
          <Col xs={6} className="d-grid">
            <div className="d-grid">
              <ButtonGroup>
                <Button
                  variant="info"
                  size="sm"
                  className="text-white fs-6"
                  onClick={handleShowJoin}
                >
                  <b>Join the group</b>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-white fs-6"
                  onClick={handleShowCreate}
                >
                  <b>Create group</b>
                </Button>
              </ButtonGroup>
            </div>

            <Modal show={showJoin} onHide={handleCloseJoin} centered>
              <Modal.Header closeButton>
                <Modal.Title>Joining group</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formGroupName">
                    <Form.Label>
                      Group <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter id"
                      onChange={(event: any) => {
                        setGroupID(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button
                      variant="info"
                      className="text-white"
                      onClick={handleJoin}
                    >
                      Join
                    </Button>
                    <Button variant="secondary" onClick={handleCloseJoin}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>

            <Modal show={showCreate} onHide={handleCloseCreate} centered>
              <Modal.Header closeButton>
                <Modal.Title>Creating new group</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
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
                      type="url"
                      placeholder="Enter url"
                      onChange={(event: any) => {
                        setGroupBackground(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button
                      variant="info"
                      className="text-white"
                      onClick={handleCreate}
                    >
                      Create
                    </Button>
                    <Button variant="secondary" onClick={handleCloseCreate}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </Col>
        </Row>

        <Groups title="My groups" groups={myGroups} />

        <ErrorModal
          modalTitle="Error detected"
          buttonTitle="Try again"
          showErrorModal={showErrorModal}
          handleCloseErrorModal={handleCloseErrorModal}
          errorMessage={errorMessage}
        />
      </Wrapper>
    </PrivateRoute>
  );
};

export default GroupsPage;
