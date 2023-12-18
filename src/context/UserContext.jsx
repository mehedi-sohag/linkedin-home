import { createContext, useContext, useState } from "react";

const UseContext = createContext();

function UseProvider({ children }) {
  const [userInfo, setUserInfo] = useState(function () {
    const user = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    return user;
  });
  return (
    <UseContext.Provider
      value={{
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </UseContext.Provider>
  );
}

function useUser() {
  const context = useContext(UseContext);
  return context;
}

export { UseProvider, useUser };
