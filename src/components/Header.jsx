import { getDatabase, onValue, ref } from "firebase/database";
import {
  getStorage,
  ref as storageref,
  getDownloadURL,
} from "firebase/storage";
import { useEffect, useState } from "react";
import {
  FiBell,
  FiHome,
  FiGrid,
  FiBriefcase,
  FiMessageSquare,
} from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Header() {
  const auth = getAuth();
  const storage = getStorage();
  const navigate = useNavigate();
  const db = getDatabase();
  const [user, setUser] = useState({});
  const { userInfo, setUserInfo } = useUser();
  const [profilePhoto, setProfilePhoto] = useState("");

  const storageRefProfile = storageref(storage, userInfo.uid + "/profile");

  //Get data from firebase initial render
  useEffect(function () {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((friend) => {
        if (userInfo.uid === friend.val().id) {
          setUser(friend.val());
          // console.log(friend.val());
        }
      });
      console.log(user);
    });
  }, []);

  useEffect(function () {
    getDownloadURL(storageRefProfile).then((downloadURL) => {
      setProfilePhoto(downloadURL);
    });
  }, []);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        setUserInfo(null);
        localStorage.removeItem("userInfo");
        toast.success("logout successfully done");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.code);
        toast.error(error.code);
      });
  }

  return (
    <>
      <div className="flex justify-between items-center px-10">
        <div className="flex items-center">
          <div className="flex gap-1">
            <div>
              <img src="./linkedin.png" alt="logo" />
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search"
                className="bg-[#EDF3F8] border-none outline-none px-2 py-1 h-8"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FiHome className="text-2xl" />
            <p className="text-base font-medium">Home</p>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FiGrid className="text-2xl" />
            <p className="text-base font-medium">My Networks</p>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FiBriefcase className="text-2xl" />
            <p className="text-base font-medium">Jobs</p>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FiMessageSquare className="text-2xl" />
            <p className="text-base font-medium">Messaging</p>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <FiBell className="text-2xl" />
            <p className="text-base font-medium">Notifications</p>
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <div
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
              onClick={handleSignOut}
            >
              <img
                src={profilePhoto ? profilePhoto : user.photo}
                alt="profile"
                className="block object-cover"
              />
            </div>
            <p className="text-base font-medium">Logout</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
