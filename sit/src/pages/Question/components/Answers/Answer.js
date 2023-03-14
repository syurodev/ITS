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

function Answer(data) {
  const currentUser = useSelector((state) => {
    return state.user.user;
  });

  const cx = classNames.bind(style);
  const navigate = useNavigate();

  const [upvoteIconColor, setUpvoteIconColor] = useState("030e12");
  const [downvoteIconColor, setDownvoteIconColor] = useState("030e12");
  const [upvote, setUpvote] = useState(data.data.upvote);
  const [downvote, setDownvote] = useState(data.data.downvote);
  const [voteNumber, setVoteNumber] = useState(0);

  useEffect(() => {
    setVoteNumber(upvote.length - downvote.length);
  }, [upvote.length, downvote.length]);

  //FORMAT UI
  useEffect(() => {
    if (upvote.length > 0 || downvote.length > 0) {
      if (upvote.includes(currentUser._id)) {
        setUpvoteIconColor("ed7966");
      }

      if (downvote.includes(currentUser._id)) {
        setDownvoteIconColor("ed7966");
      }
    }
  }, [upvote, downvote, currentUser._id]);

  // UNVOTE
  const handelUnvote = async () => {
    if (Object.keys(currentUser).length !== 0) {
      const result = await answerServices.unvote(data.data._id, {
        user: currentUser._id,
        score: data.data.user._id,
      });
      setUpvote(result.data.upvote);
      setDownvote(result.data.downvote);
      setUpvoteIconColor("030e12");
      setDownvoteIconColor("030e12");
    } else {
      navigate(routesConfig.login);
    }
  };

  //UPVOTE / DOWNVOTE
  const handelVote = async (type) => {
    if (Object.keys(currentUser).length !== 0) {
      if (type === "upvote") {
        if (!upvote.includes(currentUser._id)) {
          const result = await answerServices.upvote(data.data._id, {
            user: currentUser._id,
            score: data.data.user._id,
          });

          setUpvote(result.data.upvote);
          setDownvote(result.data.downvote);
          setUpvoteIconColor("ed7966");
          setDownvoteIconColor("030e12");
        } else {
          handelUnvote();
        }
      } else if (type === "downvote") {
        if (!downvote.includes(currentUser._id)) {
          const result = await answerServices.downvote(data.data._id, {
            user: currentUser._id,
          });

          setUpvote(result.data.upvote);
          setDownvote(result.data.downvote);
          setUpvoteIconColor("030e12");
          setDownvoteIconColor("ed7966");
        } else {
          handelUnvote();
        }
      }
    } else {
      navigate(routesConfig.login);
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
                    colors={`primary:#${upvoteIconColor}`}
                    state="hover-2"
                    style={{ width: "250", height: "250" }}
                  ></lord-icon>
                }
                onClick={() => {
                  handelVote("upvote");
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
                    colors={`primary:#${downvoteIconColor}`}
                    state="hover-2"
                    style={{ width: "250", height: "250" }}
                  ></lord-icon>
                }
                onClick={() => {
                  handelVote("downvote");
                }}
              ></Button>
            </div>
          </Tippy>
        </div>

        <div className={cx("content")}>
          {parse(data.data.answer)}
          {/* <Comment
            data={data.data.comments}
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
