import { getDatabase, onValue, ref, update } from "firebase/database";
import {
  getStorage,
  ref as storageref,
  getDownloadURL,
  uploadString,
} from "firebase/storage";

// Create a root reference

import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useUser } from "../context/UserContext";

function Main() {
  const storage = getStorage();
  const db = getDatabase();
  const [user, setUser] = useState({});
  const { userInfo } = useUser();
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [overlay, setOverlay] = useState(false);
  const [overlayCover, setOverlayCover] = useState(false);
  const [overlayProfile, setOverlayProfile] = useState(false);
  const [image, setImage] = useState(null);
  const [imageProfile, setImageProfile] = useState(null);
  const storageRef = storageref(storage, userInfo.uid + "/coverPhoto");
  const storageRefProfile = storageref(storage, userInfo.uid + "/profile");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
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
    getDownloadURL(storageRef).then((downloadURL) => {
      setCoverPhoto(downloadURL);
    });
  }, []);
  useEffect(function () {
    getDownloadURL(storageRefProfile).then((downloadURL) => {
      setProfilePhoto(downloadURL);
    });
  }, []);

  function handleUpdate() {
    setOverlay((state) => !state);
  }
  function handleSubmit() {
    update(ref(db, "users/" + userInfo.uid), {
      userName: name,
      headline: headline,
    });
    setOverlay((state) => !state);
  }
  function handleCoverSubmit() {
    uploadString(storageRef, image, "data_url").then(() => {
      getDownloadURL(storageRef).then((url) => {
        setCoverPhoto(url);
        setOverlayCover((state) => !state);
      });
    });
  }
  function handleProfileSubmit() {
    uploadString(storageRefProfile, imageProfile, "data_url").then(() => {
      getDownloadURL(storageRef).then((url) => {
        setProfilePhoto(url);
        setOverlayProfile((state) => !state);
      });
    });
  }
  function handleCoverPhoto() {
    setOverlayCover((state) => !state);
  }
  function handleProfilePhoto() {
    setOverlayProfile((state) => !state);
  }
  function onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  }
  function onChangeProfile(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageProfile(reader.result);
    };
    reader.readAsDataURL(files[0]);
  }

  return (
    <>
      {overlay ? (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center">
          <div className="w-[350px] bg-gray-100 z-20 p-4 rounded-lg shadow-lg">
            <div className="mb-2">
              <label htmlFor="name" className="block mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name here"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border outline-none px-2 py-1 rounded-md"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="headline" className="block mb-2">
                Headline
              </label>
              <input
                type="text"
                placeholder="Enter your headline here"
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full border outline-none px-2 py-1 rounded-md"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="py-1 px-2 bg-[#2567b3] rounded-md text-white"
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {overlayCover ? (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center">
          <div className="w-[350px] bg-gray-100 z-20 p-4 rounded-lg shadow-lg">
            <div>
              <input type="file" onChange={onChange} />
            </div>
            <button
              onClick={handleCoverSubmit}
              className="py-1 px-2 bg-[#2567b3] rounded-md text-white"
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      {overlayProfile ? (
        <div className="absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center">
          <div className="w-[350px] bg-gray-100 z-20 p-4 rounded-lg shadow-lg">
            <div>
              <input type="file" onChange={onChangeProfile} />
            </div>
            <button
              onClick={handleProfileSubmit}
              className="py-1 px-2 bg-[#2567b3] rounded-md text-white"
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="bg-[#F4F2EE]">
        <div className="w-11/12 mx-auto pt-10">
          <div className="flex gap-8">
            <div className="w-9/12 pb-16 relative">
              <div
                className="absolute top-[166px] left-[20px] w-[100px] h-[100px] rounded-full z-10 overflow-hidden border-2 border-white cursor-pointer"
                onClick={handleProfilePhoto}
              >
                <img
                  src={profilePhoto ? profilePhoto : user.photo}
                  alt="user image"
                  className="block object-cover"
                />
              </div>
              <div className="w-[42px] h-[42px] absolute top-[260px] right-[40px] rounded-full z-10 bg-[#EDEDED] flex items-center justify-center cursor-pointer">
                <FiEdit2 className="text-[#8F8F8F]" onClick={handleUpdate} />
              </div>
              <div className="w-[42px] h-[42px] absolute top-[40px] right-[40px] rounded-full z-10 bg-white flex items-center justify-center cursor-pointer">
                <FiEdit2
                  className="text-[#2567B3]"
                  onClick={handleCoverPhoto}
                />
              </div>
              <div className="w-full h-60 overflow-hidden">
                <img
                  src={coverPhoto ? coverPhoto : user.coverPhoto}
                  alt="coverphoto"
                  className="block object-cover h-60 w-full"
                />
              </div>
              <div className="bg-white p-8">
                <div>
                  <h1 className="font-bold text-lg">{user.userName}</h1>
                  <p className="text-base font-medium">{user.headline}</p>
                  <p className="font-normal text-base">
                    Satkhira District, Khulna, Bangladesh{" "}
                    <span className="text-[#2567B3] font-medium ml-3">
                      Contact Info
                    </span>
                  </p>
                  <p className="mt-2">
                    <span className="text-[#2567B3] font-medium">
                      105 followers
                    </span>
                    <span className="text-[#2567B3] font-medium ml-3">
                      100 connections
                    </span>
                  </p>
                  <div className="space-x-4 mt-3">
                    <button className="px-4 py-2 bg-[#2567b3] rounded-full font-semibold text-base text-white">
                      Open to
                    </button>
                    <button className="px-4 py-2  rounded-full font-semibold text-base text-[#2567b3] border border-[#2567b3]">
                      Add profile section
                    </button>
                    <button className="text-gray-500 border rounded-full border-gray-500 px-4 py-2 font-semibold text-base">
                      More
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-3/12">
              <div className="bg-white border rounded-md p-4 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-base font-bold text-gray-500">
                      Profile Language
                    </h1>
                    <p className="text-base font-medium text-gray-500">
                      English
                    </p>
                  </div>
                  <div>
                    <span>
                      <FiEdit2 className="text-2xl text-gray-500" />
                    </span>
                  </div>
                </div>
                <div className="w-11/12 h-[1px]  bg-gray-500 mx-auto"></div>

                <div className="flex justify-between">
                  <div>
                    <h1 className="text-base font-bold text-gray-500">
                      Public profile & URl
                    </h1>
                    <p className="text-base font-medium text-gray-500">
                      https://www.linkedin.com/in/md-mehedi-hasan-432631251/
                    </p>
                  </div>
                  <div>
                    <span>
                      <FiEdit2 className="text-2xl text-gray-500" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pb-5">
                <img
                  src="./user.png"
                  alt="linkedin user"
                  className="block object-cover border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
