import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import style from "./Answer.module.scss";
import Button from "~/components/Button";
import Tiptap from "~/future/tiptapEditor";
import Answer from "./Answer";
import * as AnswerServices from "~/services/answerServices";
import routesConfig from "~/config/router";

function Answers({ questionId }) {
  const navigate = useNavigate();
  const cx = classNames.bind(style);
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");

  const currentUser = useSelector((state) => {
    return state.user.user;
  });

  useEffect(() => {
    if (newAnswerContent.trim() !== "") {
      setError("");
    }
  }, [newAnswerContent]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await AnswerServices.getAnswerData(questionId);
      setAnswers(result);
    };
    fetchApi();
  }, [questionId]);

  const handelAddAnswer = () => {
    if (Object.keys(currentUser).length !== 0) {
      if (!showAnswerEditor) {
        setShowAnswerEditor(true);
      } else if (newAnswerContent.trim() === "") {
        setError("Nội dung câu trả lời không được bỏ trống");
      } else {
        const answerData = {
          question_id: questionId,
          answer: newAnswerContent,
          user: currentUser._id,
        };
        const fetchApi = async () => {
          const result = await AnswerServices.addAnswer(answerData);
          setAnswers([result.data, ...answers]);
          setShowAnswerEditor(false);
        };
        fetchApi();
      }
    } else {
      navigate(routesConfig.login);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("answer")}>
        <div className={cx("title")}>
          <div>
            <span>Answers</span>
          </div>
          <div className={cx("btns")}>
            <Button primary onClick={handelAddAnswer}>
              {showAnswerEditor ? "Add" : "Your Answer"}
            </Button>
            <div
              className={cx("cancel-btn", "hide", {
                show: showAnswerEditor,
              })}
            >
              <Button
                outline
                onClick={() => {
                  setShowAnswerEditor(false);
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>

            <span
              className={cx("error", "hide", {
                show: showAnswerEditor,
              })}
            >
              {error}
            </span>
          </div>
        </div>
        {/* EDITOR */}
        <div
          className={cx("hide", {
            show: showAnswerEditor,
          })}
        >
          <Tiptap setState={setNewAnswerContent} />
        </div>

        {/* CONTENT */}
        {answers.map((answer) => {
          return <Answer key={answer._id} data={answer} />;
        })}
      </div>
    </div>
  );
}

export default Answers;
