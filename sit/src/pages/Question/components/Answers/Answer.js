import classNames from "classnames/bind";
import parse from "html-react-parser";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "~/components/Button";
import style from "./Answer.module.scss";
import * as answerServices from "~/services/answerServices";
import routesConfig from "~/config/router";
import Image from "~/components/Image";

function Answer({ data, auth, questionId }) {
  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  const cx = classNames.bind(style);
  const navigate = useNavigate();

  const [upvoteIconColor, setUpvoteIconColor] = useState("#030e12");
  const [downvoteIconColor, setDownvoteIconColor] = useState("#030e12");
  const [soldIconColor, setSoldIconColor] = useState("#030e12");
  const [sold, setSold] = useState(data.solved);
  const [upvote, setUpvote] = useState(data.upvote);
  const [downvote, setDownvote] = useState(data.downvote);
  const [voteNumber, setVoteNumber] = useState(0);

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

    if (sold) {
      setSoldIconColor("#ed7966");
    } else {
      setSoldIconColor("#030e12");
    }
  }, [upvote, downvote, currentUser._id, sold]);

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
      };
      fetchApi();
    }
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
        </div>

        <div className={cx("content")}>
          <div className={cx("respondent")}>
            <Image
              src={data.user.avatar}
              alt={data.user.username}
              className={cx("avatar")}
            />
            <span>{data.user.username}</span>
            <span className={cx("reputationScore")}>
              {data.user.reputationScore}
            </span>
          </div>
          <div className={cx("answer-data")}>{parse(data.answer)}</div>
          {/* <Comment
            data={data.comments}
            questionId={"idQuestion"}
            currentUser={currentUser}
            type="answer"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Answer;
