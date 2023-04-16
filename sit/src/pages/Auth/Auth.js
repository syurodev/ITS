import classNames from "classnames/bind";
import { signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, provider } from "~/firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "./authSlice";
import images from "~/assets/images";
import Button from "~/components/Button";
import routesConfig from "~/config/router";
import style from "./Auth.module.scss";
import * as userServices from "~/services/authServices";

const cx = classNames.bind(style);

function Auth() {
  const router = () => {
    const href = window.location.href.includes("/register");
    if (href) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    document.title = "ITSocial :: Login/Register";
  }, []);

  const [registered, setRegistered] = useState(router);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [role, setRole] = useState(1);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const userData = {};
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    setAvatar(result.user.photoURL);
    setPhone(result.user.phoneNumber);
    setEmail(result.user.email);
  };

  const handleLoginWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);

    const loginResult = await userServices.login(
      result.user.email,
      "",
      "google"
    );
    if (loginResult.status) {
      localStorage.setItem("itsSession", JSON.stringify(loginResult.data));
      dispatch(login(loginResult.data));
      navigate(routesConfig.home);
    } else {
      setError(loginResult.message);
      setDisableButton(true);
    }
  };

  const validateEmail = () => {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (email.trim() !== "") {
      if (reg.test(email) === false) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  };

  const validateUsername = () => {
    if (username.trim() !== "") {
      if (username.trim().length <= 8) {
        setUsernameError(true);
        setError(registered ? "" : "Username phải từ 8 ký tự trở lên");
        setDisableButton(true);
      } else {
        setDisableButton(false);
        setError("");
        setUsernameError(false);
      }
    }
  };

  const validatePassword = () => {
    if (password.trim() === "") {
      setError("");
      setPasswordError(false);
      setDisableButton(false);
    } else if (password.trim().length <= 8) {
      setDisableButton(true);
      setPasswordError(true);
      setError(registered ? "" : "Vui lòng nhập password trên 8 ký tự");
    } else {
      setDisableButton(false);
      setRepasswordError(false);
      setError("");
    }
  };

  const validateRepassword = () => {
    if (password !== repassword) {
      setDisableButton(true);
      setRepasswordError(true);
      setError("Nhập lại password không chính xác");
    } else if (repassword.trim() === "") {
      setDisableButton(false);
      setRepasswordError(false);
      setError("");
    }
  };

  const handleRegister = () => {
    userData.email = email;
    userData.username = username;
    userData.password = password;
    userData.avatar = avatar;
    userData.phone = phone;
    userData.role = role;
    userData.company = company;

    if (role === "2") {
      if (company.trim() === "") {
        setError("Vui lòng nhập đầy đủ thông tin");
        return;
      }
    }

    if (password.trim() === "" || username.trim() === "") {
      setDisableButton(true);
      setError("Vui lòng nhập đầy đủ thông tin");
    } else {
      const createAccount = async () => {
        const result = await userServices.register(userData);
        if (result.status === false) {
          setError(result.message);
          setDisableButton(true);
        } else {
          localStorage.setItem("itsSession", JSON.stringify(result.data));
          dispatch(login(result.data));
          navigate(routesConfig.home);
        }
      };

      createAccount();
    }
  };

  const handleLogin = () => {
    const userLogin = async () => {
      const result = await userServices.login(username, password);
      if (result.status) {
        localStorage.setItem("itsSession", JSON.stringify(result.data));
        dispatch(login(result.data));
        navigate(routesConfig.home);
      } else {
        setError(result.message);
        setDisableButton(true);
      }
    };

    userLogin();
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("options")}>
          {registered ? (
            <div>
              <Button
                column
                leftIcon={<img src={images.google} alt="Google" width={25} />}
                onClick={handleLoginWithGoogle}
              >
                Đăng nhập với Google
              </Button>
            </div>
          ) : (
            <div>
              <Button
                onClick={handleSignWithGoogle}
                column
                leftIcon={<img src={images.google} alt="Google" width={25} />}
              >
                Đăng ký với Google
              </Button>
            </div>
          )}
        </div>
        <div className={cx("main")}>
          {registered ? (
            <></>
          ) : (
            <div className={cx("input")}>
              <label htmlFor="email">
                <span>Email:</span>
                <input
                  className={cx({
                    error: emailError,
                  })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validateEmail()}
                  onFocus={() => {
                    setEmailError(false);
                    setDisableButton(false);
                    setError("");
                  }}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Vui lòng nhập Email"
                />
              </label>
            </div>
          )}
          <div className={cx("input")}>
            <label htmlFor="username">
              <span>Username:</span>
              <input
                className={cx({
                  error: usernameError,
                })}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => validateUsername()}
                onFocus={() => {
                  setDisableButton(false);
                  setError("");
                  setUsernameError(false);
                }}
                type="text"
                name="username"
                id="username"
                placeholder={"Vui lòng nhập username"}
              />
            </label>
          </div>
          <div className={cx("input")}>
            <label htmlFor="password">
              <span>Password:</span>
              <input
                className={cx({
                  error: passwordError,
                })}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => {
                  setDisableButton(false);
                  setError("");
                  setPasswordError(false);
                }}
                onBlur={() => validatePassword()}
                type="password"
                name="password"
                id="password"
                placeholder="Vui lòng nhập password"
              />
            </label>
          </div>
          {registered ? (
            <></>
          ) : (
            <div className={cx("input")}>
              <label htmlFor="repassword">
                <span>Nhập lại password:</span>
                <input
                  className={cx({
                    error: repasswordError,
                  })}
                  value={repassword}
                  onChange={(e) => setRepassword(e.target.value)}
                  onBlur={() => validateRepassword()}
                  onFocus={() => {
                    setRepasswordError(false);
                    setDisableButton(false);
                    setError("");
                  }}
                  type="password"
                  name="repassword"
                  id="repassword"
                  placeholder="Vui lòng nhập lại password"
                />
              </label>
            </div>
          )}
          {registered ? (
            <></>
          ) : (
            <div className={cx("input")}>
              <label htmlFor="role">
                <span>Loại tài khoản:</span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  id="role"
                >
                  <option value={1}>Lập trình viên</option>
                  <option value={2}>Nhà tuyển dụng</option>
                </select>
              </label>
            </div>
          )}
          {registered ? (
            <></>
          ) : (
            role === "2" && (
              <div layout className={cx("input")}>
                <label htmlFor="name">
                  <span>Tên doanh nghiệp:</span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Vui lòng nhập tên doanh nghiệp"
                  />
                </label>
              </div>
            )
          )}
          <div className={cx("btn")}>
            {registered ? (
              <Button primary fwidth onClick={handleLogin}>
                Đăng nhập
              </Button>
            ) : disableButton ? (
              <Button primary fwidth disable>
                Đăng ký
              </Button>
            ) : (
              <Button primary fwidth onClick={handleRegister}>
                Đăng ký
              </Button>
            )}
          </div>

          <p className={cx("bottom-text")}>
            {registered ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <span
              onClick={() => {
                setRegistered(!registered);
                setError("");
                setRepassword("");
                setDisableButton(false);
              }}
            >
              {registered ? "Đăng ký" : "Đăng nhập"}
            </span>
          </p>
        </div>
      </div>
      <p className={cx("error-log")}>{error}</p>
    </div>
  );
}

export default Auth;
