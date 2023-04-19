import classNames from "classnames/bind";
import { memo } from "react";
import { Link } from "react-router-dom";

import style from "./Footer.module.scss";
import images from "~/assets/images";
import Button from "~/components/Button";
import routesConfig from "~/config/router";

const cx = classNames.bind(style);

function Footer() {
  return (
    <footer className={cx("wrapper")}>
      <div className={cx("footer-container")}>
        <div className={cx("left")}>
          <Button text ntd to={routesConfig.home}>
            <div className={cx("logo")}>
              <img
                className={cx("logo-image")}
                src={images.logo}
                alt="IT Social"
              />
            </div>
          </Button>
        </div>
        <div className={cx("center")}>
          <div className={cx("its")}>
            <span className={cx("title")}>IT Social</span>
            <div className={cx("content")}>
              <Link to={routesConfig.home}>Questions</Link>
              <Link to={routesConfig.bookmarks}>Bookmark</Link>
              <Link to={routesConfig.tags}>Tags</Link>
              <Link to={routesConfig.users}>Users</Link>
              <Link to={routesConfig.works}>Works</Link>
            </div>
          </div>
          <div className={cx("its")}>
            <span className={cx("title")}>IT Social</span>
            <div className={cx("content")}>
              <Link to={routesConfig.home}>Questions</Link>
              <Link to={routesConfig.bookmarks}>Bookmark</Link>
              <Link to={routesConfig.tags}>Tags</Link>
              <Link to={routesConfig.users}>Users</Link>
              <Link to={routesConfig.works}>Works</Link>
            </div>
          </div>
        </div>
        <div className={cx("right")}></div>
      </div>
    </footer>
  );
}

export default memo(Footer);
