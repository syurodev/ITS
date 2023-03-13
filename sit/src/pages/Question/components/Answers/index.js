import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";

import style from "./Answer.module.scss";
import Button from "~/components/Button";
import Tiptap from "~/future/tiptapEditor";
import Answer from "./Answer";
import * as AnswerServices from "~/services/answerServices";

const cx = classNames.bind(style);

function Answers({ questionId }) {
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [answerstest, setAnswersTest] = useState([]);
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
      setAnswersTest(result);
    };
    fetchApi();
  }, [questionId]);

  const handelAddAnswer = () => {
    if (!showAnswerEditor) {
      setShowAnswerEditor(true);
    } else if (newAnswerContent.trim() === "") {
      setError("Nội dung câu trả lời không được bỏ trống");
    } else {
      const answerData = {
        question_id: questionId,
        answer: newAnswerContent,
        user: currentUser,
      };
      const fetchApi = async () => {
        const result = await AnswerServices.addAnswer(answerData);
        console.log(result);
        setAnswers([result.data, ...answers]);
        setShowAnswerEditor(false);
      };
      fetchApi();
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
