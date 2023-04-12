import { memo } from "react";
import classNames from "classnames/bind";
import { easeIn, motion } from "framer-motion";
import { useState, useEffect } from "react";

import style from "./Sidebar.module.scss";
import Button from "~/components/Button";
import routesConfig from "~/config/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

function Sidebar() {
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpenSidebar(false);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={cx("wrapper")}>
      <FontAwesomeIcon
        icon={faBars}
        className={cx("open-sidebar")}
        onClick={() => setOpenSidebar(!openSidebar)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: easeIn }}
        className={cx("container", { openSidebar: openSidebar })}
      >
        <motion.div
          whileHover={{
            y: [2, -2, 2],
            transition: { duration: 1, repeat: Infinity },
          }}
          className={cx("btn")}
        >
          <Button
            to={routesConfig.home}
            text
            ntd
            start
            small
            leftIcon={
              <lord-icon
                src="https://cdn.lordicon.com/isugonwi.json"
                trigger="hover"
                colors="primary:#030e12"
                style={{ width: "250px", height: "250px" }}
              ></lord-icon>
            }
          >
            Câu hỏi
          </Button>
        </motion.div>

        <motion.div
          whileHover={{
            y: [2, -2, 2],
            transition: { duration: 1, repeat: Infinity },
          }}
          className={cx("btn")}
        >
          <Button
            to={routesConfig.bookmarks}
            text
            ntd
            start
            small
            leftIcon={
              <lord-icon
                src="https://cdn.lordicon.com/gigfpovs.json"
                trigger="hover"
                colors="primary:#030e12"
                style={{ width: "250px", height: "250px" }}
              ></lord-icon>
            }
          >
            Dấu trang
          </Button>
        </motion.div>

        <motion.div
          whileHover={{
            y: [2, -2, 2],
            transition: { duration: 1, repeat: Infinity },
          }}
          className={cx("btn")}
        >
          <Button
            text
            to={routesConfig.tags}
            ntd
            start
            small
            leftIcon={
              <lord-icon
                src="https://cdn.lordicon.com/pmegrqxm.json"
                trigger="hover"
                colors="primary:#030e12"
                style={{ width: "250px", height: "250px" }}
              ></lord-icon>
            }
          >
            Thẻ
          </Button>
        </motion.div>

        <motion.div
          whileHover={{
            y: [2, -2, 2],
            transition: { duration: 1, repeat: Infinity },
          }}
          className={cx("btn")}
        >
          <Button
            text
            to={routesConfig.users}
            ntd
            start
            small
            leftIcon={
              <lord-icon
                src="https://cdn.lordicon.com/bhfjfgqz.json"
                trigger="hover"
                colors="primary:#030e12"
                style={{ width: "250px", height: "250px" }}
              ></lord-icon>
            }
          >
            Người dùng
          </Button>
        </motion.div>

        <motion.div
          whileHover={{
            y: [2, -2, 2],
            transition: { duration: 1, repeat: Infinity },
          }}
          className={cx("btn")}
        >
          <Button
            text
            to={routesConfig.works}
            start
            small
            ntd
            leftIcon={
              <lord-icon
                src="https://cdn.lordicon.com/winbdcbm.json"
                trigger="hover"
                colors="primary:#030e12"
                style={{ width: "250px", height: "250px" }}
              ></lord-icon>
            }
          >
            Công việc
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: easeIn }}
        className={cx("over-sidebar", { openSidebar: openSidebar })}
        onClick={() => setOpenSidebar(false)}
      ></motion.div>
    </div>
  );
}

export default memo(Sidebar);
