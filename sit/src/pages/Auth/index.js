import classNames from "classnames/bind";
import { signInWithPopup } from "firebase/auth";
import { useState, useRef } from "react";
import { auth, provider } from "~/firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "./authSlice";
import images from "~/assets/images";
import Button from "~/components/Button";
import style from "./Auth.module.scss";
import { async } from "@firebase/util";

const cx = classNames.bind(style);

function Auth() {
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const userData = {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => {
    return state.user.user;
  });

  const handelSignWithGoogle = async () => {
    signInWithPopup(auth, provider).then((res) => {
      return (
        setAvatar(res.user.photoURL),
        setPhone(res.user.phoneNumber),
        setEmail(res.user.email)
      );
    });
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
        setError("Username phải từ 8 ký tự trở lên");
        setDisableButton(true);
      } else {
        setDisableButton(false);
        setError("");
        setUsernameError(false);
      }
    }
  };

  const validatePassword = () => {
    if (password !== repassword) {
      setDisableButton(true);
      setRepasswordError(true);
      setError("Nhập lại password không chính xác");
    } else if (password.trim() === "") {
      setError("");
      setPasswordError(false);
      setRepasswordError(false);
      setDisableButton(false);
    } else if (repassword.trim() === "") {
      setDisableButton(true);
      setRepasswordError(true);
      setError("Vui lòng nhập password trên 8 ký tự");
    } else if (password.trim().length <= 8) {
      setDisableButton(true);
      setPasswordError(true);
      setError("Vui lòng nhập password trên 8 ký tự");
    } else {
      setDisableButton(false);
      setRepasswordError(false);
      setRepasswordError(false);
      setError("");
    }
  };

  const handelRegister = async () => {
    userData.email = email;
    userData.username = username;
    userData.password = password;
    userData.avatar = avatar;
    userData.phone = phone;

    if (password.trim() === "" || username.trim() === "") {
      setDisableButton(true);
      setError("Vui lòng nhập đầy đủ thông tin");
    } else {
      await axios.post("/user/check", userData).then((res) => {
        if (res.data.status === false) {
          setError(res.data.message);
          setDisableButton(true);
        } else {
          axios
            .post("/user", userData)
            .then((res) => {
              dispatch(login(res.data.data));
              navigate("/");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  const handelLogin = () => {};

  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        <div className={cx("options")}>
          {registered ? (
            <div>
              <Button
                column
                leftIcon={<img src={images.google} alt="Google" width={25} />}
              >
                Đăng nhập với Google
              </Button>
            </div>
          ) : (
            <div>
              <Button
                onClick={handelSignWithGoogle}
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
                  onBlur={() => validatePassword()}
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
          <div className={cx("btn")}>
            {registered ? (
              <Button primary fwidth onClick={handelLogin}>
                Đăng nhập
              </Button>
            ) : disableButton ? (
              <Button primary fwidth disable>
                Đăng ký
              </Button>
            ) : (
              <Button primary fwidth onClick={handelRegister}>
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
