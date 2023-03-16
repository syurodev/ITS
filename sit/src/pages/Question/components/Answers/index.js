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

function Answers({ questionId, auth }) {
  const navigate = useNavigate();
  const cx = classNames.bind(style);
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [noAnswer, setNoAnswer] = useState(false);
  const [sortActive, setSortActive] = useState(true);

  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  useEffect(() => {
    if (newAnswerContent.trim() !== "") {
      setError("");
    }
  }, [newAnswerContent]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await AnswerServices.getAnswerDataSortNew(questionId);
      if (result.length === 0) {
        setNoAnswer(true);
      } else {
        setAnswers(result);
        setNoAnswer(false);
      }
    };
    fetchApi();
  }, [questionId]);

  const handleAddAnswer = () => {
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
          if (result.status) {
            const newData = await AnswerServices.getAnswerDataSortNew(
              questionId
            );
            setAnswers(newData);
            setShowAnswerEditor(false);
          }
        };
        fetchApi();
      }
    } else {
      navigate(routesConfig.login);
    }
  };

  //handle
  const handleSortVote = () => {
    setSortActive(!sortActive);
    const fetchApi = async () => {
      const result = await AnswerServices.getAnswerDataSortVote(questionId);
      if (result.length === 0) {
        setNoAnswer(true);
      } else {
        setAnswers(result);
        setNoAnswer(false);
      }
    };
    fetchApi();
  };

  const handleSortNew = () => {
    setSortActive(!sortActive);
    const fetchApi = async () => {
      const result = await AnswerServices.getAnswerDataSortNew(questionId);
      if (result.length === 0) {
        setNoAnswer(true);
      } else {
        setAnswers(result);
        setNoAnswer(false);
      }
    };
    fetchApi();
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("answer")}>
        <div className={cx("title")}>
          <div>
            <span>Answers</span>
          </div>
          <div className={cx("btns")}>
            <div className={cx("left")}>
              <Button primary onClick={handleAddAnswer}>
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
            {!noAnswer ? (
              <div>
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
            ) : (
              <div></div>
            )}
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
        {!noAnswer ? (
          answers.map((answer) => {
            return (
              <Answer
                key={answer._id}
                data={answer}
                auth={auth}
                questionId={questionId}
              />
            );
          })
        ) : (
          <div className={cx("no-item")}>
            <span>No Answer</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Answers;
