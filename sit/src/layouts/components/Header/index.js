import { useState, useEffect, memo, useCallback } from "react";
import classNames from "classnames/bind";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import { useSelector } from "react-redux";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import TippyHeadless from "@tippyjs/react/headless";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import style from "./Header.module.scss";
import Button from "~/components/Button";
import routesConfig from "~/config/router";
import images from "~/assets/images";
import Search from "../Search";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { login, logout, getData, bookmark } from "~/pages/Auth/authSlice";
import * as userServices from "~/services/authServices";
import Image from "~/components/Image";

function Header() {
  defineElement(lottie.loadAnimation);
  const [userSession, setUserSession] = useState(false);

  const cx = classNames.bind(style);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState({});
  const [openSearch, setOpenSearch] = useState(false);

  const currentUser = useSelector((state) => state.user.userId);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpenSearch(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //GET USER ID IF LOG IN AND SET SESSION
  useEffect(() => {
    if (Object.keys(currentUser).length === 0) {
      const userSession = localStorage.getItem("itsSession");
      if (userSession) {
        setCurrentUserId(JSON.parse(userSession));
        dispatch(login(JSON.parse(userSession)));
        setUserSession(true);
      } else {
        setUserSession(false);
      }
    } else {
      setCurrentUserId(currentUser);
      setUserSession(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  //GET USERDATA
  useEffect(() => {
    const sessionData = localStorage.getItem("userData");
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      if (parsedData !== userData) {
        setUserData(parsedData);
      }
    } else if (Object.keys(currentUserId).length !== 0) {
      const fetchApi = async () => {
        const result = await userServices.getUserInfo(currentUserId);
        if (result) {
          sessionStorage.setItem("userData", JSON.stringify(result[0]));
          setUserData(result[0]);
          dispatch(getData(result[0]));
          dispatch(bookmark(result[0]?.bookmark));
        }
      };
      fetchApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate(routesConfig.login);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Search openSearchModal={openSearch} />

        {userSession ? (
          <div className={cx("actions")}>
            <div className={cx("items")}>
              <Tippy content="Tìm kiếm">
                <div className={cx("search-btn")}>
                  <Button
                    text
                    onClick={() => setOpenSearch(!openSearch)}
                    leftIcon={
                      <lord-icon
                        src="https://cdn.lordicon.com/xfftupfv.json"
                        trigger="click"
                        colors="primary:#030e12"
                        style={{ width: "30px", height: "30px" }}
                      ></lord-icon>
                    }
                  ></Button>
                </div>
              </Tippy>
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
              {userData.role === 1 && (
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
              )}
              {userData.role === 2 && (
                <Tippy content="Tạo công việc">
                  <div>
                    <Button
                      to={routesConfig.newwork}
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
              )}
            </div>
            <TippyHeadless
              interactive
              hideOnClick={false}
              render={(attrs) => (
                <div className={cx("search-result")} tabIndex="-1" {...attrs}>
                  <PopperWrapper>
                    <Button
                      fwidth
                      text
                      ntd
                      leftIcon={<FontAwesomeIcon icon={faUser} />}
                      to={`/profile/${currentUserId._id}`}
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
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </Button>
                  </PopperWrapper>
                </div>
              )}
            >
              <div className={cx("avatar")}>
                <Image src={userData.avatar} alt={userData.username} />
                {/* <img src={userData.avatar} alt={userData.username} /> */}
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
      <div
        className={cx("searchModalBg", {
          show: openSearch,
        })}
        onClick={() => setOpenSearch(false)}
      ></div>
    </header>
  );
}

export default memo(Header);
