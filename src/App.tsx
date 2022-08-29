import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { auth, firestore } from "./firebase-config";
import { FirebaseContext } from "./context/firebase";
import { useAuthState } from "./hooks";

import "./styles/index.sass";

const App = () => {
  const { user, initializing } = useAuthState(auth);
  
  return (
    <FirebaseContext.Provider value={{ firestore, auth, user, initializing }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FirebaseContext.Provider>
  );
};

export default App;
