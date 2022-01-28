import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { auth, firestore } from "./firebase-config";
import { FirebaseContext } from "./context/firebase";
import { useAuthState } from "./hooks";

import "./styles/index.sass";

const App = () => {
  // console.clear()
  const { user, initializing } = useAuthState(auth);

  // const [group, setGroup] = useState<DocumentData | undefined>({});

  // const groupRef = doc(firestore, "groups", `${params.id}`);
  // useEffect(() => {
  //   const getGroup = async () => {
  //     const data = await getDoc(groupRef);
  //     setGroup(data.data());
  //   };

  //   getGroup();
  //   // eslint-disable-next-line
  // }, []);

  // console.log(
  //   "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ App @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
  // );
  // useEffect(() => {
  //   console.log(
  //     "**************************** useEffect in App ****************************"
  //   );

  //   // eslint-disable-next-line
  // }, []);

  return (
    <FirebaseContext.Provider value={{ firestore, auth, user, initializing }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FirebaseContext.Provider>
  );
};

export default App;
