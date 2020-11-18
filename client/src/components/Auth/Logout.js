import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../auth";
import { useForm } from "react-hook-form";

export default function Login(props) {
  const { fetchWithCSRF, setCurrentUserId } = useContext(AuthContext);
  let history = useHistory();

  async function logoutUser() {
    const response = await fetchWithCSRF("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      // body: JSON.stringify(data)
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.log("response not ok:", response);
      // setErrors(responseData.errors);
    } else {
      // setOpen(false);
      console.log("response)");
      setCurrentUserId(responseData.current_user_id);
      history.push("/");
    }
  }
  useEffect(() => {
    logoutUser();
  }, []);

  return <></>;
}
