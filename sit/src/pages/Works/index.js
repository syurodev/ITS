import classNames from "classnames/bind";

import style from "./Works.module.scss";

function Works() {
  const cx = classNames.bind(style);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("top-nav")}>
        <h1>Works</h1>
      </div>
    </div>
  );
}

export default Works;
