import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FC, useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Avatar, ErrorModal, Groups, PrivateRoute } from "../components";
import { FirebaseContext } from "../context/firebase";
import { useFirestoreQuery } from "../hooks";
import { getUser } from "../utils";

// import "../styles/pages/profile.sass";

const ProfilePage: FC = (props) => {
  const { firestore } = useContext(FirebaseContext);

  const user = getUser();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseErrorModal = () => setShowErrorModal(false);
  const handleShowErrorModal = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const params = useParams();

  const [profile, setProfile] = useState<DocumentData | undefined>({});

  const profileRef = doc(firestore, "users", `${params.id}`);
  useEffect(() => {
    const getProfile = async () => {
      const data = await getDoc(profileRef);
      setProfile(data.data());
    };

    getProfile();
    // eslint-disable-next-line
  }, []);

  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const [profileLastname, setProfileLastname] = useState("");
  const [profileFirstname, setProfileFirstname] = useState("");

  const handleCloseProfileSettings = () => setShowProfileSettings(false);
  const handleShowProfileSettings = () => setShowProfileSettings(true);

  const db = getFirestore();

  const handleChangeProfile = async () => {
    try {
      setShowProfileSettings(false);

      if (profileLastname === "")
        throw new Error("You haven't entered lastname.");
      if (profileFirstname === "")
        throw new Error("You haven't entered firstname.");

      const newProfile = {
        lastName: profileLastname,
        firstName: profileFirstname,
      };

      const changeDocRef = doc(db, "users", `${params.id}`);
      await updateDoc(changeDocRef, newProfile);
    } catch (error: any) {
      handleShowErrorModal(error.message);
    } finally {
      setProfileLastname("");
      setProfileFirstname("");
    }
  };

  const userGroupsCollectionRef = collection(firestore, "groups");
  const userGroupsQuery = query(
    userGroupsCollectionRef,
    where("users", "array-contains", `${params.id}`)
  );
  const userGroups = useFirestoreQuery(userGroupsQuery);

  console.log(params.id);
  console.log(profile);

  const isAdmin = user.id === params.id;

  return (
    <PrivateRoute>
      <Container className="mt-5">
        <div className="d-flex justify-content-center">
          <Avatar email={profile?.email} height={150} size={250} />
        </div>

        <h1 className="text-white d-flex justify-content-center mt-3">
          {`${profile?.lastName} ${profile?.firstName}`}
        </h1>

        <h4 className="text-muted d-flex justify-content-center mt-1 fs-5">
          {params.id}
        </h4>

        {isAdmin ? (
          <div className="d-flex justify-content-center mt-5">
            <Button
              variant="secondary"
              size="lg"
              className="text-white fs-6"
              onClick={() => {
                handleShowProfileSettings();
                setProfileLastname(profile?.lastName);
                setProfileFirstname(profile?.firstName);
              }}
            >
              <i className="fas fa-cog"></i> <b>Settings</b>
            </Button>

            <Modal
              show={showProfileSettings}
              onHide={handleCloseProfileSettings}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Profile settings</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Lastname <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      defaultValue={profileLastname}
                      type="text"
                      placeholder="Enter lastname"
                      onChange={(event: any) => {
                        setProfileLastname(event.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Firstname <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      defaultValue={profileFirstname}
                      type="text"
                      placeholder="Enter firstname"
                      onChange={(event: any) => {
                        setProfileFirstname(event.target.value);
                      }}
                    />
                  </Form.Group>

                  <Modal.Title className="mb-3 fs-6 text-secondary">
                    {`To change `}
                    <b>Avatar</b>
                    {` of the profile please use `}
                    <a
                      href="http://gravatar.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fs-6 text-secondary"
                    >
                      <b>gravatar.com</b>
                    </a>
                    {`, signing up with your "`}
                    <b>{`${profile?.email}`}</b>
                    {`" email.`}
                  </Modal.Title>

                  <div className="d-grid gap-2 mt-4">
                    <Button
                      variant="info"
                      className="text-white"
                      onClick={handleChangeProfile}
                    >
                      <b>Save changes</b>
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-white"
                      onClick={handleCloseProfileSettings}
                    >
                      <b>Cancel</b>
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        ) : null}

        <Groups title="User groups" groups={userGroups} />
      </Container>

      <ErrorModal
        modalTitle="Error detected"
        buttonTitle="Try again"
        showErrorModal={showErrorModal}
        handleCloseErrorModal={handleCloseErrorModal}
        errorMessage={errorMessage}
      />
    </PrivateRoute>
  );
};

export default ProfilePage;
