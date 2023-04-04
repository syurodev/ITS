import { useState } from "react";
import classNames from "classnames/bind";
import { Link, useParams } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useEffect } from "react";
import { motion } from "framer-motion";

import formatDate from "~/future/formatDate";
import Button from "~/components/Button";
import style from "./Questions.module.scss";
import * as questionServices from "~/services/questionServices";
import Image from "~/components/Image";
import CustomTagsInput from "~/components/TagsInput";
import Pagination from "~/components/Pagination";

const cx = classNames.bind(style);

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [sortActive, setSortActive] = useState(true);
  const [totalPages, setTotalPages] = useState([]);
  const [page, setPage] = useState(1);

  const [tags, setTags] = useState([]);
  const { tag = null } = useParams();
  const { user = null } = useParams();

  const [filter, setFilter] = useState({
    limit: 10,
    sort: "createdAt",
    page: 1,
    user: user && user,
    tags: [],
  });

  useEffect(() => {
    const newTagsPargams = [];
    if (tags.length > 0) {
      tags.forEach((tag) => {
        newTagsPargams.push(tag.text);
      });
    }
    if (tag) {
      newTagsPargams.push(tag);
    }
    setFilter((prevFilter) => ({
      ...prevFilter,
      tags: newTagsPargams,
    }));
  }, [tag, tags]);

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      user: user && user,
    }));
  }, [user]);

  useEffect(() => {
    const getQuestion = async () => {
      const result = await questionServices.getQuestions(
        filter.limit,
        filter.sort,
        filter.tags,
        filter.user,
        filter.page
      );
      setQuestions(result.data);
      setPage(result.page);
      const pageArray = Array.from(
        { length: result.totalPages },
        (_, i) => i + 1
      );
      setTotalPages(pageArray);
    };
    getQuestion();
  }, [filter]);

  const handleSortVote = () => {
    setSortActive(!sortActive);
    setFilter((prevFilter) => ({
      ...prevFilter,
      sort: "upvote",
    }));
  };

  const handleSortNew = () => {
    setSortActive(!sortActive);
    setFilter((prevFilter) => ({
      ...prevFilter,
      sort: "createdAt",
    }));
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("top-nav")}>
        <h1>Top Questions</h1>
        <div className={cx("sort")}>
          <div className={cx("tags-sort")}>
            <CustomTagsInput tags={tags} setTags={setTags} />
          </div>
          {sortActive ? (
            <Button primary small nmw>
              New
            </Button>
          ) : (
            <Button outline small nmw onClick={handleSortNew}>
              New
            </Button>
          )}
          {sortActive ? (
            <Button outline small nmw onClick={handleSortVote}>
              Vote
            </Button>
          ) : (
            <Button primary small nmw>
              Vote
            </Button>
          )}
        </div>
      </div>
      <div className={cx("container")}>
        {questions &&
          questions.map((question) => {
            const tags = JSON.parse(question.tags[0]);

            const questionTime = formatDate(question.createdAt);

            return (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                key={question._id}
                className={cx("item")}
              >
                <div className={cx("header")}>
                  <Link
                    className={cx("user")}
                    to={`/profile/${question.user._id}`}
                  >
                    <div className={cx("avata")}>
                      <Image
                        src={question.user.avatar}
                        alt={question.user.username}
                      />
                    </div>
                    <div className={cx("username")}>
                      {question.user.username}
                    </div>
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
        {totalPages && (
          <Pagination
            totalPages={totalPages}
            setFilter={setFilter}
            currentPage={page}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
