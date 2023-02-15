import React from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import Button from "~/components/Button";

const cx = classNames.bind(style);

const Home = () => {
  return (
    <div className={cx("wrapper")}>
      <Button text>Click</Button>
    </div>
  );
};

export default Home;
