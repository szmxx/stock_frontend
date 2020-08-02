import Cookies from "js-cookie";
const SESSION_KEY = "session-key";
export const getSession = () => {
  return Cookies.get(SESSION_KEY);
};

export const addCookies = code => {
  Cookies.set("userCode", code);
};

export const removeCookies = () => {
  Cookies.remove("userCode");
};
