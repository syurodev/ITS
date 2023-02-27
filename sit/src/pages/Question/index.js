import React from "react";
import classNames from "classnames/bind";

import style from "./Question.module.scss";

const cx = classNames.bind(style);

const Question = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h1 className={cx("title")}>
          Use Mock in Jest test for rendering element in screen and find them
          with "findAllBy" method
        </h1>
        <div className={cx("info")}>
          <span>Asked today</span>
          <span>Modified today</span>
          <span>Viewed 18 times</span>
        </div>
      </div>
      <div className={cx("content")}>
        <div className={cx("problem")}></div>
        <div className={cx("expecting")}></div>
      </div>
    </div>
  );
};

export default Question;
