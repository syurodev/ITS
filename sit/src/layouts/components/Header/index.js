import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import TippyHeadless from "@tippyjs/react/headless";
import { useSelector } from "react-redux";

import style from "./Header.module.scss";
import Button from "~/components/Button";
import { Wrapper as PopperWrapper } from "~/components/Popper";
import SearchQuestionItem from "~/components/SearchQuestionItem";

import images from "~/assets/images";

defineElement(lottie.loadAnimation);
const cx = classNames.bind(style);

function Header() {
  const currentUser = useSelector((state) => {
    return state.user.user;
  });
  console.log(currentUser);
  const [input, setInput] = useState("");
  const [changeSearchButton, setChangeSearchButton] = useState(false);
  const searchIcon = useRef();

  useEffect(() => {
    if (input.length > 0) {
      setChangeSearchButton(true);
    } else {
      setChangeSearchButton(false);
    }
  }, [input]);

  useEffect(() => {
    if (changeSearchButton) {
      searchIcon.current.innerHTML = `<lord-icon
          src="https://cdn.lordicon.com/xfftupfv.json"
          trigger="loop"
          delay="500"
          colors="primary:#ed7966"
          style={{ width: "30px", height: "30px" }}
      </lord-icon>`;
    } else {
      searchIcon.current.innerHTML = `<lord-icon
        src="https://cdn.lordicon.com/xfftupfv.json"
        trigger="click"
        colors="primary:#030e12"
        style={{ width: "30px", height: "30px" }}
      ></lord-icon>`;
    }
  }, [changeSearchButton]);

  return (
    <header className={cx("wrapper")}>
      <div className={cx("topbar-container")}>
        <Button text ntd to="/">
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
        <TippyHeadless
          interactive
          render={(attrs) => (
            <div className={cx("search-result")} tabIndex="-1" {...attrs}>
              <PopperWrapper>
                <SearchQuestionItem />
                <SearchQuestionItem />
                <SearchQuestionItem />
                <SearchQuestionItem />
              </PopperWrapper>
            </div>
          )}
        >
          <div className={cx("search-box")}>
            <input
              className={cx("search-input")}
              type="text"
              placeholder="Search..."
              onChange={(e) => setInput(e.target.value)}
            />
            <button ref={searchIcon} className={cx("search-button")}></button>
          </div>
        </TippyHeadless>

        <div className={cx("actions")}>
          <Button outline>Đăng ký</Button>
          <Button primary>Đăng nhập</Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
