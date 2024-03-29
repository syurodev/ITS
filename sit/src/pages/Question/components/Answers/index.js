import { useState, useEffect, useCallback, memo } from "react";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import style from "./Answer.module.scss";
import Button from "~/components/Button";
import Tiptap from "~/components/TiptapEditor";
import Answer from "./Answer";
import * as AnswerServices from "~/services/answerServices";
import routesConfig from "~/config/router";
import { motion } from "framer-motion";

function Answers({ questionId, auth, answerSolved, userRole = 1 }) {
  const navigate = useNavigate();
  const cx = classNames.bind(style);
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [noAnswer, setNoAnswer] = useState(false);
  const [sortActive, setSortActive] = useState(2);
  const [answerCount, setAnswerCount] = useState(0);
  const [showAnswerSolved, setShowAnswerSolved] = useState(answerSolved);

  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  useEffect(() => {
    if (newAnswerContent.trim() !== "") {
      setError("");
    }
  }, [newAnswerContent]);

  //Fetch api
  useEffect(() => {
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
  }, [questionId, answerCount]);

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
            setAnswerCount(answerCount + 1);
            setNewAnswerContent("");
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
  const handleSortVote = useCallback(() => {
    setSortActive(2);
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
  }, [questionId]);

  const handleSortNew = useCallback(() => {
    setSortActive(1);
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

  const handleSortSolved = useCallback(() => {
    setSortActive(0);
    const fetchApi = async () => {
      const result = await AnswerServices.getAnswerDataSolved(showAnswerSolved);
      if (result.length === 0) {
        setNoAnswer(true);
      } else {
        setAnswers(result);
        setNoAnswer(false);
      }
    };
    fetchApi();
  }, [showAnswerSolved]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("answer")}>
        <div className={cx("title")}>
          <div>
            <span>Answers</span>
          </div>
          <div className={cx("btns")}>
            <div className={cx("left")}>
              {userRole !== 2 && (
                <Button primary onClick={handleAddAnswer}>
                  {showAnswerEditor ? "Add" : "Your Answer"}
                </Button>
              )}

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
                {showAnswerSolved ? (
                  sortActive === 0 ? (
                    <Button primary successfully small nmw>
                      Solved
                    </Button>
                  ) : (
                    <Button
                      outlineSuccessfully
                      small
                      nmw
                      onClick={() => handleSortSolved(answerSolved)}
                    >
                      Solved
                    </Button>
                  )
                ) : (
                  <></>
                )}
                {sortActive === 1 ? (
                  <Button primary small nmw>
                    New
                  </Button>
                ) : (
                  <Button outline small nmw onClick={handleSortNew}>
                    New
                  </Button>
                )}
                {sortActive === 2 ? (
                  <Button primary small nmw>
                    Vote
                  </Button>
                ) : (
                  <Button outline small nmw onClick={handleSortVote}>
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
              <motion.div
                layout
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                key={answer._id}
              >
                <Answer
                  data={answer}
                  auth={auth}
                  questionId={questionId}
                  answerSolved={answerSolved}
                  handleSortVote={handleSortVote}
                  setShowAnswerSolved={setShowAnswerSolved}
                />
              </motion.div>
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

export default memo(Answers);
