import firebaseConfig from "./firebase/firebaseConfig";
import User from "./User";
import Login from "./Login";
import Registration from "./Registration";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UseProvider } from "./context/UserContext";

function App() {
  return (
    <UseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
        </Routes>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 2000,
            },
            error: {
              duration: 3000,
            },
            style: {
              fontSize: "16px",
              padding: "8px 12px",
              maxWidth: "500px",
            },
          }}
        />
      </BrowserRouter>
    </UseProvider>
  );
}

export default App;
