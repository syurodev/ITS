import classNames from "classnames/bind";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import style from "./Ask.module.scss";
import Button from "~/components/Button";
import Tiptap from "~/components/TiptapEditor";
import routesConfig from "~/config/router";
import * as questionServices from "~/services/questionServices";
import CustomTagsInput from "~/components/TagsInput";

const Ask = () => {
  const cx = classNames.bind(style);
  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [expecting, setExpecting] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ITSocial :: Ask";
  }, []);

  const handleSubmit = async () => {
    if (
      title.trim() !== "" &&
      problem.trim() !== "" &&
      expecting.trim() !== "" &&
      tags.length > 0
    ) {
      const newTags = [];
      // eslint-disable-next-line array-callback-return
      tags.map((tag) => {
        newTags.push(tag.text);
      });

      const bodyJSON = {
        title: title,
        problem: problem,
        expecting: expecting,
        tags: JSON.stringify(newTags),
        user: currentUser._id,
      };

      const fetchApi = async () => {
        const result = await questionServices.ask(bodyJSON);
        navigate(`/question/${result._id}`);
      };
      fetchApi();
    } else {
      setError("Hãy điền đầy đủ tất cả các trường");
    }
  };

  return (
    <motion.div
      className={cx("wrapper")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cx("container")}>
        <div className={cx("head-title")}>
          <h1>Đặt câu hỏi</h1>
        </div>
        <div className={cx("add-question-container")}>
          <div className={cx("question-options")}>
            <div className={cx("question-option")}>
              <div className={cx("question-title")}>
                <label htmlFor="title">
                  <h2 className={cx("title")}>Tiêu đề</h2>
                  <small>Mô tả ngắn gọn vấn đề của bạn</small>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề câu hỏi"
                    id="title"
                    className={cx("input")}
                    onFocus={() => setError("")}
                  />
                </label>
              </div>
            </div>

            <div className={cx("question-option")}>
              <div className={cx("question-problem")}>
                <h2 className={cx("title")}>Chi tiết vấn đề của bạn là gì?</h2>
                <small>Mô tả chi tiết những gì bạn đặt ở tiêu đề</small>
                <Tiptap setState={setProblem} setError={setError} />
              </div>
            </div>

            <div className={cx("question-option")}>
              <div className={cx("question-expecting")}>
                <h2 className={cx("title")}>
                  Bạn đã thử những gì và mong muốn điều gì?
                </h2>
                <small>
                  Mô tả những gì bạn đã thử và những gì bạn mong đợi
                </small>
                <Tiptap setState={setExpecting} setError={setError} />
              </div>
            </div>

            <div className={cx("question-option")}>
              <div className={cx("question-tags")}>
                <CustomTagsInput tags={tags} setTags={setTags} />
              </div>
            </div>

            {error && (
              <div className={cx("error")}>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className={cx("btns")}>
            <Button outline to={routesConfig.home}>
              Huỷ
            </Button>
            <Button primary onClick={handleSubmit}>
              Tạo câu hỏi
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Ask;
