import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import style from "./SearchQuestionItem.module.scss";
import Button from "../Button";

function SearchQuestionItem({ data }) {
  const cx = classNames.bind(style);
  return (
    <div className={cx("wrapper")}>
      <p className={cx("title")}>{data.title}</p>
      <div className={cx("tags")}>
        {JSON.parse(data.tags[0]).map((tag, index) => {
          return (
            <Button text small className={cx("tag")} key={index}>
              #{tag}
            </Button>
          );
        })}
      </div>
      <div className={cx("info")}>
        <div className={cx("info-item")}>
          <FontAwesomeIcon icon={faAngleUp} />
          <span>{data.upvote.length}</span>
        </div>
        <div className={cx("info-item")}>
          <FontAwesomeIcon icon={faAngleDown} />{" "}
          <samp>{data.downvote.length}</samp>
        </div>
        <div className={cx("info-item")}>
          <FontAwesomeIcon icon={faEye} />
          <span>{data.viewed}</span>
        </div>
      </div>
    </div>
  );
}

export default SearchQuestionItem;
