import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";
import { useUser } from "./context/UserContext";
import { useEffect } from "react";

function User() {
  const { userInfo } = useUser();

  const navigate = useNavigate();
  const verify = userInfo?.emailVerified ?? false;

  useEffect(
    function () {
      if (!verify) {
        navigate("/login");
      }
    },
    [verify, navigate]
  );

  return (
    <div>
      <Header />
      <Main />
    </div>
  );
}

export default User;
