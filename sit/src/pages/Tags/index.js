import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import * as questionServices from "~/services/questionServices";
import style from "./Tags.module.scss";

function Tags() {
  const cx = classNames.bind(style);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await questionServices.getTags();
      console.log(result);
    };
    fetchApi();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("top-nav")}>
        <h1>Tags</h1>
      </div>
      <div className={cx("container")}>
        <div className={cx("item")}></div>
      </div>
    </div>
  );
}

export default Tags;
