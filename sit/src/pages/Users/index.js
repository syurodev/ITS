import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import * as userServices from "~/services/authServices";
import style from "./Users.module.scss";
import { useDebounce } from "~/hooks";
import Image from "~/components/Image";
import Pagination from "~/components/Pagination";

function Users() {
  const cx = classNames.bind(style);
  const [users, setUsers] = useState([]);
  const [usersSearch, setUsersSearch] = useState([]);
  const [usersSearchLoading, setUsersSearchLoading] = useState(false);
  const [totalPages, setTotalPages] = useState([]);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    username: "",
  });

  let debounced = useDebounce(usersSearch, 500);

  useEffect(() => {
    setUsersSearchLoading(true);
    const fetchApi = async () => {
      const result = await userServices.getAllUsers(
        filter.username,
        filter.limit,
        filter.page
      );
      setUsers(result.data);
      const pageArray = Array.from(
        { length: result.pagination.pages },
        (_, i) => i + 1
      );
      setTotalPages(pageArray);
      setUsersSearchLoading(false);
    };
    fetchApi();
  }, [filter]);

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      username: debounced,
    }));
  }, [debounced]);

  const handleChange = (e) => {
    if (e.target.value.startsWith(" ")) {
      setUsersSearch("");
    } else {
      setUsersSearch(e.target.value);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("top-nav")}>
        <h1>Users</h1>
        <div className={cx("search-box")}>
          <input
            type="text"
            className={cx("tags-search")}
            onChange={handleChange}
            placeholder="Enter username..."
          />
          {usersSearchLoading && (
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
        {users &&
          users.map((user) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                key={user._id}
                className={cx("user-item")}
              >
                <Link to={`/profile/${user._id}`} className={cx("avatar")}>
                  <Image src={user.avatar} alt={user.username} />
                </Link>
                <div className={cx("info")}>
                  <Link to={`/profile/${user._id}`} className={cx("username")}>
                    {user.username}
                  </Link>
                  <div>
                    <span className={cx("reputation-score-title")}>
                      Reputation Score:
                    </span>
                    <span className={cx("reputation-score")}>
                      {user.reputationScore}
                    </span>
                  </div>
                  <div className={cx("tags")}>
                    <span className={cx("title")}>Top tags: </span>
                    {user.tags.length > 0 ? (
                      user.tags.map((tag, index) => {
                        return (
                          <Link
                            className={cx("tag")}
                            key={index}
                            to={`/${tag.name}/${user._id}`}
                          >
                            #{tag.name}
                          </Link>
                        );
                      })
                    ) : (
                      <span className={cx("no-tag")}>No tag</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        <Pagination
          totalPages={totalPages}
          setFilter={setFilter}
          currentPage={filter.page}
        />
      </div>
    </div>
  );
}

export default Users;
