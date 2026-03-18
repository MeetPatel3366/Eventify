import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stopLoding, verifyToken } from "../store/authSlice";

// eslint-disable-next-line react/prop-types
export const AuthInit = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // useEffect(() => {
  //     if (localStorage.getItem("token")) {
  //         dispatch(verifyToken());
  //     } else {
  //         console.log("stopping loading")
  //         dispatch(stopLoding())
  //     }
  // }, [])

  useEffect(() => {
    const hasSessionCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("auth_session=1"));
    const hasSession = localStorage.getItem("hasSession") === "1";

    if (hasSessionCookie || hasSession) {
      dispatch(verifyToken());
    } else {
      dispatch(stopLoding());
    }
  }, [dispatch]);

  if (loading) {
    return null;
  }

  return children;
};
