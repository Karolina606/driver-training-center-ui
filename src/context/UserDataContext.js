import { createContext } from "react";

const UserDataContext = createContext({
  userData: {},
  setUserData: () => {}
});

export default UserDataContext;