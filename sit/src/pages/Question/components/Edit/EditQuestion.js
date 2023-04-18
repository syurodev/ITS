import { useState } from "react";
import classNames from "classnames/bind";

import * as questionServices from "~/services/questionServices";
import Modal from "~/components/Modal";
import CustomTagsInput from "~/components/TagsInput";
import style from "./EditQuestion.module.scss";
import Button from "~/components/Button";
import Tiptap from "~/components/TiptapEditor";

function EditQuestion({
  closeModal,
  questionTitle = "",
  questionProblem = "",
  questionExpecting = "",
  questionTags = [],
  questionId,
  fetchApi,
}) {
  const outputArray = questionTags.map((item) => ({ id: item, text: item }));

  const cx = classNames.bind(style);
  const [title, setTitle] = useState(questionTitle);
  const [problem, setProblem] = useState(questionProblem);
  const [expecting, setExpecting] = useState(questionExpecting);
  const [tags, setTags] = useState(outputArray);
  const [error, setError] = useState("");

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
        id: questionId,
        title: title,
        problem: problem,
        expecting: expecting,
        tags: JSON.stringify(newTags),
      };

      const fetchApi = async () => {
        // eslint-disable-next-line no-unused-vars
        const result = await questionServices.editQuestion(bodyJSON);
        fetchApi();
        closeModal(false);
      };
      fetchApi();
    } else {
      setError("Hãy điền đầy đủ tất cả các trường");
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className={cx("container")}>
        <div className={cx("head-title")}>
          <h1>Sửa câu hỏi</h1>
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
                <Tiptap
                  setState={setProblem}
                  setError={setError}
                  content={problem}
                />
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
                <Tiptap
                  setState={setExpecting}
                  setError={setError}
                  content={expecting}
                />
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
            <Button outline onClick={() => closeModal(false)}>
              Huỷ
            </Button>
            <Button primary onClick={handleSubmit}>
              Sửa
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default EditQuestion;
