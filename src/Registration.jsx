import { Link, useNavigate } from "react-router-dom";
import { useReducer } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

const initialState = {
  name: "",
  email: "",
  password: "",
  nameError: null,
  emailError: null,
  passwordError: null,
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
    case "name":
      return {
        ...state,
        name: action.payload,
        nameError: null,
      };
    case "nameError":
      return {
        ...state,
        nameError: "active",
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
        passwordError:
          action.payload === "auth/weak-password" ? "short" : "active",
      };

    case "submit":
      return {
        ...state,
        name: "",
        email: "",
        password: "",
      };
    case "cancel":
      return {
        ...initialState,
      };
    default:
      throw new Error("Unknown type");
  }
}
function Registration() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [
    { name, nameError, email, emailError, password, passwordError },
    dispatch,
  ] = useReducer(reducer, initialState);
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) {
      dispatch({ type: "nameError" });
    }
    if (!email) {
      dispatch({ type: "emailError" });
    }
    if (!password) {
      dispatch({ type: "passwordError" });
    }
    if (name && email && password) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // console.log(userCredential);
          // sendEmailVerification(auth.currentUser);
          // dispatch({ type: "submit" });
          // toast.success("successfully created your account");

          // setTimeout(() => {
          //   navigate("/login");
          // }, 2500);
          updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: "./profile.png",
          }).then(() => {
            console.log(userCredential);
            sendEmailVerification(auth.currentUser);
            dispatch({ type: "submit" });
            toast.success("successfully created your account");

            setTimeout(() => {
              navigate("/login");
            }, 2500);
          });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
          if (error.code === "auth/weak-password") {
            dispatch({ type: "passwordError", payload: error.code });
          }
          if (error.code === "auth/email-already-in-use") {
            // dispatch({ type: "passwordError", payload: error.code });
            toast.error("Email is already used");
          }
          if (error.code === "auth/network-request-failed") {
            toast.error(error.code);
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
          <h1 className="text-[#2567B3] font-inter font-medium text-3xl mb-4">
            Welcome to Linkedin
          </h1>
        </div>

        <form action="#" className="w-96" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="fullname"
              className="text-[#2567B3] font-inter text-base font-medium block mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              value={name}
              onChange={(e) =>
                dispatch({ type: "name", payload: e.target.value })
              }
              className="py-2.5 px-3 font-normal font-inter text-gray-700 text-base rounded-md border-gray-200 outline-none border w-full"
            />
            {nameError === "active" ? (
              <div className="text-red-500 flex text-base items-center gap-1">
                <span>
                  <FiAlertTriangle />
                </span>
                <span>please enter your name !</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
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
              onChange={(e) =>
                dispatch({ type: "email", payload: e.target.value })
              }
              className="py-2.5 px-3 font-normal font-inter text-gray-700 text-base rounded-md border-gray-200 outline-none border w-full"
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
          <div className="mb-6">
            <label
              htmlFor="password"
              className="text-[#2567B3] font-inter text-base font-medium block mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              id="password"
              onChange={(e) =>
                dispatch({ type: "password", payload: e.target.value })
              }
              className="py-2.5 px-3 font-normal font-inter text-gray-700 text-base rounded-md border-gray-200 outline-none border w-full"
            />
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

            {passwordError === "short" ? (
              <div className="text-red-500 flex text-base items-center gap-1">
                <span>
                  <FiAlertTriangle />
                </span>
                <span>password should be at least 6 characters !</span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="mb-6">
            <button className="bg-[#2567B3] text-white px-4 py-3.5 text-base font-inter font-medium rounded-md w-full mb-4">
              Create account
            </button>
            <button
              className="text-[#2567B3] px-4 py-3.5 text-base font-inter font-medium rounded-md border border-[#2567B3] w-full"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
          <p className="text-base font-inter font-normal text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-inter text-base font-medium text-[#2567B3]"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration;
