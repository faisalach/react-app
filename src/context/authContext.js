import React from "react";

const authData = {
  signedIn: false,
};
export default React.createContext({authData: {...authData}, setAuthData: (val) => {}});