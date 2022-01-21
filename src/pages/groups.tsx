import { FC, useContext, useState } from "react";
import {
  Button,
  Container,
  Alert,
  Row,
  Col,
  Modal,
  Form,
  ButtonGroup,
} from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useFirestoreQuery } from "../hooks";
import { PrivateRoute, Avatar } from "../components";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { getUser, setUser } from "../utils";

const GroupsPage: FC = (props) => {
  // console.clear();

  console.log(
    "++++++++++++++++++++++++++++++++++++++ GroupsPage ++++++++++++++++++++++++++++++++++++++"
  );

  const { firestore } = useContext(FirebaseContext);

  const user = getUser();

  const myGroupsCollectionRef = collection(firestore, "groups");
  const myGroupsQuery = query(
    myGroupsCollectionRef,
    where("users", "array-contains", user.id)
  );
  const myGroups = useFirestoreQuery(myGroupsQuery);

  console.log("~~~~~~~~~~~~~~~~ myGroups ~~~~~~~~~~~~~~~~");
  console.log(user);
  console.log(myGroups);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  const allGroupsCollectionRef = collection(firestore, "groups");
  const allGroupsQuery = query(allGroupsCollectionRef);
  const allGroups = useFirestoreQuery(allGroupsQuery);

  console.log(
    "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
  );

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
      const groupDoc = await getDoc(doc(db, "groups", groupID));

      await setDoc(doc(db, "groups", groupID), {
        ...groupDoc.data(),
        users: [...groupDoc.data()?.users, user.id],
      });

      let userDoc = await getDoc(doc(db, "users", user.id));

      await setDoc(doc(db, "users", user.id), {
        ...userDoc.data(),
        groups: [...userDoc.data()?.groups, groupID],
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
      setShowJoin(false);

      setGroupName("");
      setGroupAvatar("");
      setGroupBackground("");
    }
  };

  const handleCreate = async () => {
    try {
      const groupRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        avatarURL: groupAvatar,
        backgroundURL: groupBackground,
        admins: [user.id],
        users: [user.id],
      });

      let userDoc = await getDoc(doc(db, "users", user.id));

      await setDoc(doc(db, "users", user.id), {
        ...userDoc.data(),
        groups: [...userDoc.data()?.groups, groupRef.id],
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
      setShowCreate(false);

      setGroupName("");
      setGroupAvatar("");
      setGroupBackground("");
    }
  };

  return (
    <PrivateRoute>
      <Container className="mt-5">
        <Row>
          <Col xs={7}>
            <h1 className="text-white">Groups</h1>
          </Col>
          <Col xs={5} className="d-grid">
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
                    <Form.Label>Group</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter id"
                      onChange={(event) => {
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
                  <Form.Group className="mb-3" controlId="formGroupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter group name"
                      onChange={(event) => {
                        setGroupName(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGroupAvatarURL">
                    <Form.Label>Avatar</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="Enter url"
                      onChange={(event) => {
                        setGroupAvatar(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="formGroupBackgroundURL"
                  >
                    <Form.Label>Background</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="Enter url"
                      onChange={(event) => {
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
        <Alert variant="dark box mt-5">
          <h2 className="text-white">My groups</h2>
          <Container className="d-grid gap-3 mt-5">
            {myGroups?.map((item: any, index: number) => (
              <Button
                variant="secondary"
                href={`${ROUTES.GROUPS}/${item.id}`}
                key={item.id}
                className="user-btn"
              >
                <Row>
                  <Col xs={1} className="user-number">
                    <h4>{index + 1}.</h4>
                  </Col>
                  <Col xs={1} className="user-avatar">
                    <Avatar href={item.avatarURL} height={32} size={50} />
                  </Col>
                  <Col xs={12} sm={10} className="user-email">
                    <h4>{item.name}</h4>
                  </Col>
                </Row>
              </Button>
            ))}
          </Container>
        </Alert>

        <Alert variant="dark box mt-5">
          <h2 className="text-white">All groups</h2>
          <Container className="d-grid gap-3 mt-5">
            {allGroups?.map((item: any, index: number) => (
              <Button
                variant="secondary"
                href="#"
                key={item.id}
                className="user-btn"
              >
                <Row>
                  <Col xs={1} className="user-number">
                    <h4>{index + 1}.</h4>
                  </Col>
                  <Col xs={1} className="user-avatar">
                    <Avatar href={item.avatarURL} height={32} size={50} />
                  </Col>
                  <Col xs={12} sm={10} className="user-email">
                    <h4>{item.name}</h4>
                  </Col>
                </Row>
              </Button>
            ))}
          </Container>
        </Alert>
      </Container>
    </PrivateRoute>
  );
};

export default GroupsPage;
