import React from "react";
import classNames from "classnames/bind";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";

import style from "./Home.module.scss";
import Button from "~/components/Button";

defineElement(lottie.loadAnimation);
const cx = classNames.bind(style);

const Home = () => {
  return (
    <div className={cx("wrapper")}>
      <h1>Home Page</h1>
      <Button
        primary
        rounded
        leftIcon={
          <lord-icon
            src="https://cdn.lordicon.com/akuwjdzh.json"
            trigger="hover"
            style={{ width: "250px", height: "250px" }}
          ></lord-icon>
        }
        large
      >
        Log in to web
      </Button>
      <Button outline rounded large>
        Log in to web
      </Button>
    </div>
  );
};

export default Home;
