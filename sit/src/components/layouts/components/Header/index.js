import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import style from "./Header.module.scss";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import Button from "~/components/Button";

import images from "~/assets/images";

defineElement(lottie.loadAnimation);
const cx = classNames.bind(style);

function Header() {
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
        <div className={cx("search-box")}>
          <input
            className={cx("search-input")}
            type="text"
            placeholder="Search..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button ref={searchIcon} className={cx("search-button")}></button>
        </div>

        <div className={cx("actions")}>
          <Button outline>Đăng ký</Button>
          <Button primary>Đăng nhập</Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
