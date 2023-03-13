import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import { useSelector } from "react-redux";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import TippyHeadless from "@tippyjs/react/headless";

import style from "./Header.module.scss";
import Button from "~/components/Button";
import images from "~/assets/images";
import { LoadUserState } from "~/redux/loadstate";
import Search from "../Search";
import routesConfig from "~/config/router";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import * as userServices from "~/services/authServices";

defineElement(lottie.loadAnimation);

const cx = classNames.bind(style);

function Header() {
  let currentUser = useSelector((state) => {
    return state.user.user;
  });

  let bookmarks = useSelector((state) => {
    return state.user.bookmark;
  });

  useEffect(() => {
    const getBookmark = async () => {
      const result = await userServices.getBookmark(currentUser._id);
      sessionStorage.setItem("bookmark", JSON.stringify(result.data));
    };
    getBookmark();
  }, []);

  let state = {
    currentUser,
    bookmarks,
  };
  LoadUserState(state);

  const session = () => {
    if (Object.keys(currentUser).length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const [user, setUser] = useState(session);

  return (
    <header className={cx("wrapper")}>
      <div className={cx("topbar-container")}>
        <Button text ntd to={routesConfig.home}>
          <div className={cx("logo")}>
            <img
              className={cx("logo-image")}
              src={images.logo}
              alt="IT Social"
            />
            <samp className={cx("logo-text")}>IT Social</samp>
          </div>
        </Button>

        {/* Search Box */}
        <Search />

        {user ? (
          <div className={cx("actions")}>
            <div className={cx("items")}>
              <Tippy content="Thông báo">
                <div>
                  <Button
                    text
                    leftIcon={
                      <lord-icon
                        src="https://cdn.lordicon.com/psnhyobz.json"
                        trigger="hover"
                        colors="primary:#030e12"
                        state="hover"
                        style={{ width: "250", height: "250" }}
                      ></lord-icon>
                    }
                  ></Button>
                </div>
              </Tippy>
              <Tippy content="Tạo câu hỏi">
                <div>
                  <Button
                    to={routesConfig.ask}
                    text
                    leftIcon={
                      <lord-icon
                        src="https://cdn.lordicon.com/wfadduyp.json"
                        trigger="hover"
                        colors="primary:#030e12"
                        state="hover-2"
                        style={{ width: "250", height: "250" }}
                      ></lord-icon>
                    }
                  ></Button>
                </div>
              </Tippy>
            </div>
            <TippyHeadless
              interactive
              render={(attrs) => (
                <div className={cx("search-result")} tabIndex="-1" {...attrs}>
                  <PopperWrapper>
                    <Button
                      fwidth
                      text
                      ntd
                      leftIcon={<FontAwesomeIcon icon={faUser} />}
                    >
                      Xem hồ sơ
                    </Button>
                    <Button
                      fwidth
                      text
                      ntd
                      leftIcon={
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                      }
                    >
                      Đăng xuất
                    </Button>
                  </PopperWrapper>
                </div>
              )}
            >
              <div className={cx("avatar")}>
                <img src={currentUser.avatar} alt={currentUser.username} />
              </div>
            </TippyHeadless>
          </div>
        ) : (
          <div className={cx("actions")}>
            <Button outline to={routesConfig.register}>
              Đăng ký
            </Button>
            <Button primary to={routesConfig.login}>
              Đăng nhập
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
