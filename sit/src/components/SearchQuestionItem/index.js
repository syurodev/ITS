import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import style from "./SearchQuestionItem.module.scss";
import Button from "../Button";

const cx = classNames.bind(style);

function SearchQuestionItem() {
  return (
    <div className={cx("wrapper")}>
      <h2 className={cx("title")}>Loop inside React JSX</h2>
      <div className={cx("tags")}>
        <Button text small className={cx("tag")}>
          #javascript
        </Button>
        <Button text small className={cx("tag")}>
          #react
        </Button>
        <Button text small className={cx("tag")}>
          #jsx
        </Button>
      </div>
      <div className={cx("info")}>
        <div className={cx("info-item")}>
          <FontAwesomeIcon icon={faAngleUp} />
          <span>2k</span>
        </div>
        <div className={cx("info-item")}>
          <FontAwesomeIcon icon={faAngleDown} /> <samp>2</samp>
        </div>
        <div className={cx("info-item")}>
          <FontAwesomeIcon icon={faEye} />
          <span>3k</span>
        </div>
      </div>
    </div>
  );
}

export default SearchQuestionItem;
