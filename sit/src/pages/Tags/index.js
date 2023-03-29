import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { motion } from "framer-motion";

import * as questionServices from "~/services/questionServices";
import style from "./Tags.module.scss";
import { Link } from "react-router-dom";
import { useDebounce } from "~/hooks";

function Tags() {
  const cx = classNames.bind(style);
  const [tags, setTags] = useState([]);
  const [tagsSearch, setTagsSearch] = useState([]);
  const [tagsSearchLoading, setTagsSearchLoading] = useState(false);

  let debounced = useDebounce(tagsSearch, 500);

  const handleChange = (e) => {
    if (e.target.value.startsWith(" ")) {
      setTagsSearch("");
    } else {
      setTagsSearch(e.target.value);
    }
  };

  useEffect(() => {
    setTagsSearchLoading(true);
    const fetchApi = async () => {
      const result = await questionServices.getTags(debounced);
      setTags(result.result);
      setTagsSearchLoading(false);
    };
    fetchApi();
  }, [debounced]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("top-nav")}>
        <h1>Tags</h1>
        <div className={cx("search-box")}>
          <input
            type="text"
            className={cx("tags-search")}
            onChange={handleChange}
            placeholder="Enter tag..."
          />
          {tagsSearchLoading && (
            <lord-icon
              src="https://cdn.lordicon.com/ymrqtsej.json"
              trigger="loop"
              delay="0"
              style={{ width: "250", height: "250" }}
            ></lord-icon>
          )}
        </div>
      </div>
      <div className={cx("container")}>
        {tags.map((tag, index) => {
          return (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              key={index}
            >
              <Link to={`/${tag.name}`}>
                <div className={cx("item")}>
                  <span className={cx("tag-name")}>#{tag.name}</span>
                  <span className={cx("count")}>{tag.count} questions</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Tags;
