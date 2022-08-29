import { BrowserRouter } from "react-router-dom";
import { FirebaseContext } from "./context/firebase";
import { auth, firestore } from "./firebase-config";
import { useAuthState } from "./hooks";
import AppRoutes from "./routes";

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
