import classNames from "classnames/bind";
import style from "./Sidebar.module.scss";

import Button from "~/components/Button";

const cx = classNames.bind(style);

function Sidebar() {
  return (
    <div className={cx("wrapper")}>
      <Button
        text
        leftIcon={
          <lord-icon
            src="https://cdn.lordicon.com/gqzfzudq.json"
            trigger="hover"
            colors="primary:#ed7966,secondary:#030e12"
            style={{ width: "250px", height: "250px" }}
          ></lord-icon>
        }
      >
        Câu hỏi
      </Button>
    </div>
  );
}

export default Sidebar;
