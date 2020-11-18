import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../auth";
import { useForm } from "react-hook-form";

export default function Login(props) {
  const { fetchWithCSRF, setCurrentUserId } = useContext(AuthContext);
  let history = useHistory();

  const {
    register,
    errors,
    setError,
    getValues,
    setValue,
    clearErrors,
    control,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function loginUser(data) {
    // console.log(email, password)
    console.log(data);
    const response = await fetchWithCSRF("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!response.ok) {
      // setErrors(responseData.errors);
    } else {
      // setOpen(false);
      setCurrentUserId(responseData.current_user_id);
      // history.push('/')
    }
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   loginUser(email, password);
  //   // return <Redirect to="/" />;
  // }

  const handleDemoUserSubmit = (e) => {
    e.preventDefault();
    loginUser({ email: "ian@aa.io", password: "password" });
  };

  return (
    <form onSubmit={handleSubmit(loginUser)}>
      <label className="add-loc__label" htmlFor="email">
        Email
      </label>
      {errors.email && (
        <div className="add-loc__err">Please enter a valid email</div>
      )}
      <input
        ref={register({
          required: true,
          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        })}
        name="email"
        placeholder="Email/Username"
      />
      <input
        ref={register({ required: true })}
        name="password"
        placeholder="Password"
        type="password"
      />
      <button>Login</button>
      <button onClick={handleDemoUserSubmit}>Login as Demo User</button>
    </form>
  );
}
