import React from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";

const cx = classNames.bind(style);

const Home = () => {
  return (
    <div className={cx("wrapper")}>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
