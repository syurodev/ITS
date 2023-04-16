import classNames from "classnames/bind";
import parse from "html-react-parser";
import Tippy from "@tippyjs/react";
import { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Prism from "~/future/prism";

import Button from "~/components/Button";
import style from "./Answer.module.scss";
import * as answerServices from "~/services/answerServices";
import routesConfig from "~/config/router";
import Image from "~/components/Image";
import Modal from "~/components/Modal";

function Answer({
  data,
  auth,
  questionId,
  answerSolved,
  handleSortVote,
  setShowAnswerSolved,
}) {
  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  const cx = classNames.bind(style);
  const navigate = useNavigate();

  const [upvoteIconColor, setUpvoteIconColor] = useState("#030e12");
  const [downvoteIconColor, setDownvoteIconColor] = useState("#030e12");
  const [soldIconColor, setSoldIconColor] = useState("#030e12");
  const [sold, setSold] = useState(answerSolved === data._id);
  const [upvote, setUpvote] = useState(data.upvote);
  const [downvote, setDownvote] = useState(data.downvote);
  const [voteNumber, setVoteNumber] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const authAnswer = currentUser._id === data.user._id;

  useEffect(() => {
    setVoteNumber(upvote.length - downvote.length);
  }, [upvote.length, downvote.length]);

  //FORMAT UI
  useEffect(() => {
    if (upvote.length > 0 || downvote.length > 0) {
      if (upvote.includes(currentUser._id)) {
        setUpvoteIconColor("#ed7966");
      }

      if (downvote.includes(currentUser._id)) {
        setDownvoteIconColor("#ed7966");
      }
    }
    if (answerSolved === data._id) {
      setSoldIconColor("#ed7966");
    } else {
      setSoldIconColor("#030e12");
    }

    Prism.highlightAll();
  }, [upvote, downvote, currentUser._id, answerSolved, data._id]);

  // UNVOTE
  const handleUnvote = async () => {
    if (Object.keys(currentUser).length !== 0) {
      const result = await answerServices.unvote(data._id, {
        user: currentUser._id,
        score: data.user._id,
      });
      setUpvote(result.data.upvote);
      setDownvote(result.data.downvote);
      setUpvoteIconColor("#030e12");
      setDownvoteIconColor("#030e12");
    } else {
      navigate(routesConfig.login);
    }
  };

  //UPVOTE / DOWNVOTE
  const handleVote = async (type) => {
    if (Object.keys(currentUser).length !== 0) {
      if (type === "upvote") {
        if (!upvote.includes(currentUser._id)) {
          const result = await answerServices.upvote(data._id, {
            user: currentUser._id,
            score: data.user._id,
          });

          setUpvote(result.data.upvote);
          setDownvote(result.data.downvote);
          setUpvoteIconColor("#ed7966");
          setDownvoteIconColor("#030e12");
        } else {
          handleUnvote();
        }
      } else if (type === "downvote") {
        if (!downvote.includes(currentUser._id)) {
          const result = await answerServices.downvote(data._id, {
            user: currentUser._id,
          });

          setUpvote(result.data.upvote);
          setDownvote(result.data.downvote);
          setUpvoteIconColor("#030e12");
          setDownvoteIconColor("#ed7966");
        } else {
          handleUnvote();
        }
      }
    } else {
      navigate(routesConfig.login);
    }
  };

  const handleSolved = (sold) => {
    if (sold) {
      setSoldIconColor("#ed7966");

      const fetchApi = async () => {
        const dataQuery = {
          id: data._id,
          auth: data.user._id,
          question: questionId,
          solved: sold,
        };

        const result = await answerServices.solved(dataQuery);
        if (result.status) {
          setShowAnswerSolved(data._id);
        }
      };
      fetchApi();
    } else {
      setSoldIconColor("#030e12");

      const fetchApi = async () => {
        const dataQuery = {
          id: data._id,
          auth: data.user._id,
          question: questionId,
          solved: sold,
        };

        const result = await answerServices.solved(dataQuery);
        if (result.status) {
          handleSortVote();
          setShowAnswerSolved();
        }
      };
      fetchApi();
    }
  };

  const handleDelete = () => {
    const fetchApi = async () => {
      // eslint-disable-next-line no-unused-vars
      const result = await answerServices.deleteAnswer(data._id);
    };
    fetchApi();
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("answer-item")}>
        <div className={cx("action")}>
          <Tippy content="Upvote" placement="left">
            <div>
              <Button
                text
                micon
                onlyicon
                leftIcon={
                  <lord-icon
                    src="https://cdn.lordicon.com/xsdtfyne.json"
                    trigger="click"
                    colors={`primary:${upvoteIconColor}`}
                    state="hover-2"
                    style={{ width: "250", height: "250" }}
                  ></lord-icon>
                }
                onClick={() => {
                  handleVote("upvote");
                }}
              ></Button>
            </div>
          </Tippy>
          <div className={cx("vote")}>{voteNumber}</div>
          <Tippy content="Downvote" placement="left">
            <div>
              <Button
                text
                micon
                onlyicon
                leftIcon={
                  <lord-icon
                    src="https://cdn.lordicon.com/rxufjlal.json"
                    trigger="click"
                    colors={`primary:${downvoteIconColor}`}
                    state="hover-2"
                    style={{ width: "250", height: "250" }}
                  ></lord-icon>
                }
                onClick={() => {
                  handleVote("downvote");
                }}
              ></Button>
            </div>
          </Tippy>
          {auth ? (
            <Tippy content="Solved" placement="left">
              <div>
                <Button
                  text
                  micon
                  onlyicon
                  leftIcon={
                    <lord-icon
                      src="https://cdn.lordicon.com/egiwmiit.json"
                      trigger="click"
                      colors={`primary:${soldIconColor}`}
                      state="hover"
                      style={{ width: "250", height: "250" }}
                    ></lord-icon>
                  }
                  onClick={() => {
                    handleSolved(!sold);
                    setSold(!sold);
                  }}
                ></Button>
              </div>
            </Tippy>
          ) : (
            <></>
          )}
          {authAnswer && (
            <Tippy content="Delete" placement="left">
              <div>
                <Button
                  text
                  onlyicon
                  leftIcon={
                    <lord-icon
                      src="https://cdn.lordicon.com/kfzfxczd.json"
                      trigger="click"
                      colors="primary:#030e12"
                      state="hover-empty"
                      style={{ width: "250", height: "250" }}
                    ></lord-icon>
                  }
                  onClick={() => setDeleteConfirm(true)}
                ></Button>
              </div>
            </Tippy>
          )}
        </div>

        <div className={cx("content")}>
          <Link to={`/profile/${data.user._id}`} className={cx("respondent")}>
            <Image
              src={data.user.avatar}
              alt={data.user.username}
              className={cx("avatar")}
            />
            <span>{data.user.username}</span>
            <span className={cx("reputationScore")}>
              {data.user.reputationScore}
            </span>
          </Link>
          <div className={cx("answer-data")}>{parse(data.answer)}</div>
          {/* <Comment
            data={data.comments}
            questionId={"idQuestion"}
            currentUser={currentUser}
            type="answer"
          /> */}
        </div>
      </div>
      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <Modal closeModal={setDeleteConfirm}>
          <p className={cx("delete-modal-title")}>
            Bạn có chắc muốn xoá bài viết
          </p>
          {/* <p className={cx("post-title-delete")}>{title}</p> */}
          <div className={cx("btns")}>
            <Button danger small onClick={handleDelete}>
              Xoá
            </Button>
            <Button outline small onClick={() => setDeleteConfirm(false)}>
              Huỷ
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default memo(Answer);
