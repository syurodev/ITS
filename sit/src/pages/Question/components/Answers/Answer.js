import classNames from "classnames/bind";
import Tiptap from "~/future/tiptapEditor";
import parse from "html-react-parser";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Button from "~/components/Button";
import Comment from "../Comment";
import style from "./Answer.module.scss";
import * as answerServices from "~/services/answerServices";

const cx = classNames.bind(style);

function Answer(data) {
  const currentUser = useSelector((state) => {
    return state.user.user;
  });

  const [upvoteIconColor, setUpvoteIconColor] = useState("030e12");
  const [downvoteIconColor, setDownvoteIconColor] = useState("030e12");
  const [upvote, setUpvote] = useState(data.data.upvote);
  const [downvote, setDownvote] = useState(data.data.downvote);
  const [voteNumber, setVoteNumber] = useState(0);

  useEffect(() => {
    setVoteNumber(upvote.length - downvote.length);
  }, [upvote.length, downvote.length]);

  // UNVOTE
  const handelUnvote = async () => {
    const result = await answerServices.unvote(data.data._id, {
      user: currentUser._id,
    });
    setUpvote(result.data.upvote);
    setDownvote(result.data.downvote);
    setUpvoteIconColor("030e12");
    setDownvoteIconColor("030e12");
  };

  //UPVOTE / DOWNVOTE
  const handelVote = async (type) => {
    if (type === "upvote") {
      if (!upvote.includes(currentUser._id)) {
        const result = await answerServices.upvote(data.data._id, {
          user: currentUser._id,
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
