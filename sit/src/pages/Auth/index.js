import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";

import images from "~/assets/images";
import Button from "~/components/Button";
import style from "./Auth.module.scss";
import { auth, provider } from "~/firebase";

const cx = classNames.bind(style);

const handelSignWithGoogle = () => {
  signInWithPopup(auth, provider).then((res) => {
    console.log(res);
  });
};

function Auth() {
  const [registered, setRegistered] = useState(false);

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
              <Button
                column
                leftIcon={<img src={images.github} alt="Github" width={25} />}
              >
                Đăng nhập với Github
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
              <Button
                column
                leftIcon={<img src={images.github} alt="Github" width={25} />}
              >
                Đăng ký với Github
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
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Vui lòng nhập Email"
                />
              </label>
            </div>
          )}
          <div className={cx("input")}>
            <label htmlFor="username">
              <span>Tên đăng nhập:</span>
              <input
                type="text"
                name="username"
                id="username"
                placeholder={
                  registered
                    ? "Tên đăng nhập hoặc Email"
                    : "Vui lòng nhập tên đăng nhập"
                }
              />
            </label>
          </div>
          <div className={cx("input")}>
            <label htmlFor="password">
              <span>Mật khẩu:</span>
              <input
                type="text"
                name="password"
                id="password"
                placeholder="Vui lòng nhập mật khẩu"
              />
            </label>
          </div>
          {registered ? (
            <></>
          ) : (
            <div className={cx("input")}>
              <label htmlFor="repassword">
                <span>Nhập lại mật khẩu:</span>
                <input
                  type="text"
                  name="repassword"
                  id="repassword"
                  placeholder="Vui lòng nhập lại mật khẩu"
                />
              </label>
            </div>
          )}

          <div className={cx("btn")}>
            <Button primary fwidth>
              {registered ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </div>

          <p className={cx("bottom-text")}>
            {registered ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
            <span
              onClick={() => {
                setRegistered(!registered);
              }}
            >
              {registered ? "Đăng ký" : "Đăng nhập"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
