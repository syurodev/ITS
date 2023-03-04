import classNames from "classnames/bind";
import style from "./Sidebar.module.scss";

import Button from "~/components/Button";
import routesConfig from "~/config/router";

const cx = classNames.bind(style);

function Sidebar() {
  return (
    <div className={cx("wrapper")}>
      <Button
        to={routesConfig.home}
        text
        start
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

      <Button
        text
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

      <Button
        text
        to={routesConfig.tags}
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

      <Button
        text
        to={routesConfig.users}
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

      <Button
        text
        to={routesConfig.works}
        start
        small
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
    </div>
  );
}

export default Sidebar;
