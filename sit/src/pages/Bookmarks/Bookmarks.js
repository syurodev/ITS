/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import style from "./Bookmarks.module.scss";
import * as userServices from "~/services/authServices";
import Button from "~/components/Button";
import routesConfig from "~/config/router";
import formatDate from "~/future/formatDate";

function Bookmarks() {
  const cx = classNames.bind(style);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  let currentUser = useSelector((state) => {
    return state.user.userId;
  });

  useEffect(() => {
    document.title = "ITSocial :: Bookmarks";
  }, []);

  useEffect(() => {
    if (Object.keys(currentUser).length === 0) {
      const userSession = localStorage.getItem("itsSession");
      if (!userSession) {
        navigate(routesConfig.login);
      }
    }
  }, []);

  let bookmarks = useSelector((state) => {
    return state.user.bookmark;
  });

  //GET USER BOOKMARKS DATA
  useEffect(() => {
    if (Object.keys(currentUser).length !== 0) {
      const fetchApi = async () => {
        const result = await userServices.getAllBookmark(bookmarks);
        setQuestions(result);
      };
      fetchApi();
    }
  }, [bookmarks]);

  return (
    <div className={cx("wrapper")}>
      <h1>Bookmarks</h1>
      <div className={cx("container")}>
        {questions.map((question) => {
          let tags = JSON.parse(question.tags[0]);
          let questionTime = formatDate(question.createdAt);

          return (
            <motion.div
              key={question._id}
              className={cx("item")}
              layout
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className={cx("header")}>
                <Link
                  className={cx("user")}
                  to={`/profile/${question.user._id}`}
                >
                  <div className={cx("avata")}>
                    <img
                      src={question.user.avatar}
                      alt={question.user.username}
                    />
                  </div>
                  <div className={cx("username")}>{question.user.username}</div>
                  <Tippy content="Điểm hoạt động">
                    <div className={cx("score")}>
                      {question.user.reputationScore}
                    </div>
                  </Tippy>
                </Link>

                <div className={cx("info")}>
                  <span>
                    {question.upvote.length - question.downvote.length} vote
                  </span>
                  <span>0 answers</span>
                  <span>{question.viewed} views</span>
                  <span>asked {questionTime}</span>
                  {question.solved ? (
                    <span className={cx("solved")}>Solved</span>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className={cx("title")}>
                <Link to={`/question/${question._id}`} className={cx("link")}>
                  {question.title}
                </Link>
              </div>
              <div className={cx("tags")}>
                {tags.map((tag, index) => (
                  <Button
                    key={index}
                    text
                    small
                    className={cx("tag")}
                    to={`/${tag}`}
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Bookmarks;