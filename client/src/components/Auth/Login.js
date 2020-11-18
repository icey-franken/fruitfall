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
      username: "",
      password: "",
    },
  });

  async function loginUser(data) {
    // add invalid error to username if problem logging in
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
    // 		<div className="content-cont">
    //       <div className="auth__cont">
    //     <form onSubmit={handleSubmit(loginUser)}>
    //       <label className="add-loc__label" htmlFor="email">
    //         Email or Username
    //       </label>
    //       {errors.email && (
    //         <div className="add-loc__err">Please enter your email or username</div>
    //       )}
    //       <input
    //         ref={register({ required: true })}
    //         name="email"
    //         placeholder="Email/Username"
    //       />
    //       <label className="add-loc__label" htmlFor="email">
    //         Password
    //       </label>
    //       {errors.password && (
    //         <div className="add-loc__err">Please enter a password</div>
    //       )}
    //       <input
    //         ref={register({ required: true })}
    //         name="password"
    //         placeholder="Password"
    //         type="password"
    //       />
    //       <button>Login</button>
    //       <button onClick={handleDemoUserSubmit}>Login as Demo User</button>
    //     </form>
    //   );
    // }
    <div className="content-cont">
      <div className="auth__cont">
        <form onSubmit={handleSubmit(loginUser)}>
          <div className="add-loc__cont-inner">
            <div className="add-loc__el add-loc__el-col">
              <label className="add-loc__label" htmlFor="username">
                Username or Email
              </label>
              {errors.username?.type === "required" && (
                <div className="add-loc__err">
                  Please enter your username or email
                </div>
              )}
              {errors.username?.type === "invalid" && (
                <div className="add-loc__err">
                  Please enter a valid username or email
                </div>
              )}
              <input
                ref={register({ required: true })}
                name="username"
                placeholder="Username/Email"
              />
            </div>

            <div className="add-loc__el add-loc__el-col">
              <label className="add-loc__label" htmlFor="password">
                Password
              </label>
              {errors.password?.type === "required" && (
                <div className="add-loc__err">Please enter a password</div>
              )}
              {errors.password?.type === "invalid" && (
                <div className="add-loc__err">Password is incorrect</div>
              )}

              <input
                ref={register({
                  required: true,
                })}
                name="password"
                placeholder="Password"
                type="password"
              />
            </div>
            <div className="add-loc__btn-cont">
              <button className="btn add-loc__btn">Log in</button>
            </div>
            <div className="existing-user__cont">
              <div>Don't have an account?</div>
              <div
                className="existing-user__link"
                onClick={() => history.push("/signup")}
              >
                Sign Up!
              </div>
            </div>
						<div className="existing-user__cont">
              <div>Just want to look around?</div>
              <div
                className="existing-user__link"
                onClick={handleDemoUserSubmit}
              >
                Log in as Demo User!
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
