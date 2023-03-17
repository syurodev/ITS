import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import * as questionServices from "~/services/questionServices";
import style from "./Tags.module.scss";
import { Link } from "react-router-dom";

function Tags() {
  const cx = classNames.bind(style);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await questionServices.getTags();
      setTags(result.tags);
    };
    fetchApi();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("top-nav")}>
        <h1>Tags</h1>
      </div>
      <div className={cx("container")}>
        {tags.map((tag, index) => {
          return (
            <Link key={index}>
              <div className={cx("item")}>
                <span className={cx("tag-name")}>#{tag.name}</span>
                <span className={cx("count")}>{tag.count} questions</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Tags;
