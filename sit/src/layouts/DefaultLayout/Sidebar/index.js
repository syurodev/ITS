import classNames from "classnames/bind";
import { motion } from "framer-motion";

import style from "./Sidebar.module.scss";
import Button from "~/components/Button";
import routesConfig from "~/config/router";

const cx = classNames.bind(style);

function Sidebar() {
  return (
    <div className={cx("wrapper")}>
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
          smallLeft
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
          smallLeft
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
          smallLeft
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
          smallLeft
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
          smallLeft
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
    </div>
  );
}

export default Sidebar;
