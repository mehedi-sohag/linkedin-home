import {
  getAuth,
  signInWithEmailAndPassword,
  // signInWithPopup,
  // signInWithRedirect,
  // GoogleAuthProvider,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

import { Link, useNavigate } from "react-router-dom";
import { useReducer } from "react";
import { FiAlertTriangle, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useUser } from "./context/UserContext";

const initialState = {
  email: "",
  password: "",
  emailError: null,
  passwordError: null,
  isOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "email":
      return {
        ...state,
        email: action.payload,
        emailError: null,
      };
    case "emailError":
      return {
        ...state,
        emailError: "active",
      };

    case "password":
      return {
        ...state,
        password: action.payload,
        passwordError: null,
      };
    case "passwordError":
      return {
        ...state,
        passwordError: "active",
      };
    case "submit":
      return {
        ...state,
        email: "",
        password: "",
      };
    case "cancel":
      return {
        ...initialState,
      };

    case "icon":
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    default:
      throw new Error("Unknown type");
  }
}

function Login() {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const [{ email, emailError, password, passwordError, isOpen }, dispatch] =
    useReducer(reducer, initialState);
  const { setUserInfo } = useUser();

  function handleIcon() {
    dispatch({ type: "icon" });
  }
  function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      dispatch({ type: "emailError" });
    }
    if (!password) {
      dispatch({ type: "passwordError" });
    }
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          if (user.emailVerified) {
            toast.success("login successfully done");
            setUserInfo(user);
            localStorage.setItem("userInfo", JSON.stringify(user));
            set(ref(db, "users/" + user.uid), {
              userName: user.displayName,
              email: user.email,
              coverPhoto: "./cover-photo.jpg",
              photo: "./profile.png",
              headline: "Programmer | Designer | Developer",
              id: user.uid,
            });
            setTimeout(() => {
              dispatch({ type: "submit" });
              navigate("/user");
            }, 2000);
          } else {
            toast.error("please verify your email address");
          }
        })
        .catch((error) => {
          console.log(error.code);
          if (error.code === "auth/network-request-failed") {
            toast.error(error.code);
            console.log(error.code);
          }
          if (error.code === "auth/invalid-credential") {
            toast.error("please verify your email address");
            console.log(error.code);
          }
        });
    }
  }
  function handleCancel(e) {
    e.preventDefault();
    dispatch({ type: "cancel" });
  }

  return (
    <div className="min-h-screen max-w-full flex items-center justify-center">
      <div>
        <div className="mb-6">
          <h1 className="text-[#2567B3] font-inter font-medium text-3xl">
            Login to your account
          </h1>
        </div>

        <form action="#" className="w-96" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="text-[#2567B3] font-inter text-base font-medium block mb-2"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              id="email"
              placeholder="Enter your email"
              onChange={(e) =>
                dispatch({ type: "email", payload: e.target.value })
              }
              className="py-2.5 px-3 font-normal font-inter text-gray-700 text-base rounded-md border-[#2567B3] outline-none border w-full placeholder:font-inter placeholder:font-normal placeholder:text-gray-200 placeholder:text-base"
            />
            {emailError === "active" ? (
              <div className="text-red-500 flex text-base items-center gap-1">
                <span>
                  <FiAlertTriangle />
                </span>
                <span>please enter your email !</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="text-[#2567B3] font-inter text-base font-medium block mb-2"
            >
              Password
            </label>
            <input
              type={isOpen ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={password}
              id="password"
              onChange={(e) =>
                dispatch({ type: "password", payload: e.target.value })
              }
              className="py-2.5 px-3 font-normal font-inter text-gray-700 text-base rounded-md border-[#2567B3] outline-none border w-full placeholder:font-inter placeholder:font-normal placeholder:text-base placeholder:text-gray-200"
            />
            <span
              onClick={handleIcon}
              className="cursor-pointer absolute right-3 top-[46px]"
            >
              {isOpen ? (
                <FiEye className="text-gray-500" />
              ) : (
                <FiEyeOff className="text-gray-500" />
              )}
            </span>
            {passwordError === "active" ? (
              <div className="text-red-500 flex text-base items-center gap-1">
                <span>
                  <FiAlertTriangle />
                </span>
                <span>please enter your password !</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="mb-6">
            <button className="bg-[#2567B3] text-white px-4 py-3.5 text-base font-inter font-medium rounded-md w-full mb-4">
              Submit
              {/* <svg
                  className="w-5 h-5 rounded-full border border-white border-b-0 animate-spin"
                  // viewBox="0 0 24 24"
                ></svg> */}
            </button>
            <button
              className="text-[#2567B3] px-4 py-3.5 text-base font-inter font-medium rounded-md border border-[#2567B3] w-full"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
          <p className="text-base font-inter font-normal text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/registration"
              className="font-inter text-base font-medium text-[#2567B3]"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
