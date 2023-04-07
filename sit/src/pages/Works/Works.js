import classNames from "classnames/bind";
import { useEffect } from "react";

import style from "./Works.module.scss";

function Works() {
  const cx = classNames.bind(style);

  useEffect(() => {
    document.title = "ITSocial :: Works";
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("top-nav")}>
        <h1>Works</h1>
      </div>
    </div>
  );
}

export default Works;
