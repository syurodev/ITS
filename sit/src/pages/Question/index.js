import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import axios from "axios";
import parse from "html-react-parser";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import Tippy from "@tippyjs/react";

import style from "./Question.module.scss";
import timeElapsed from "~/future/timeElapsed";
import Button from "~/components/Button";

const cx = classNames.bind(style);

const Question = () => {
  const [title, setTitle] = useState("");
  const [upvote, setUpvote] = useState(0);
  const [downvote, setDownvote] = useState(0);
  const [viewed, setViewed] = useState(0);
  const [createdAt, setCreatedAt] = useState();
  const [editAt, setEditAt] = useState();
  const [problem, setProblem] = useState("");
  const [expecting, setExpecting] = useState("");
  const [solved, setSolved] = useState(false);
  const [user, setUser] = useState({});
  const [tags, setTags] = useState([]);

  useEffect(() => {
    let urlSplit = window.location.href.split("/", -1);
    let idQuestion = urlSplit[4];

    const getQuestionDetail = async () => {
      // const data =
      await axios
        .get(`/api/questions/${idQuestion}`)
        .then((res) => {
          console.log("dataRes: ", res);
          setTitle(res.data[0].title);
          setUpvote(res.data[0].upvote);
          setDownvote(res.data[0].downvote);
          setViewed(res.data[0].viewed);
          setCreatedAt(res.data[0].createdAt);
          setEditAt(res.data[0].editAt);
          setProblem(res.data[0].problem);
          setExpecting(res.data[0].expecting);
          setSolved(res.data[0].solved);
          setUser(res.data[0].user);
          setTags(JSON.parse(res.data[0].tags[0]));
        })
        .catch((err) => {
          console.log(err);
        });
      // .finally(() => {
      //   console.log("FormatText");
      //   hljs.highlightAll();
      // });
      // console.log(data);
    };
    getQuestionDetail();
  }, [window.location.href]);

  const questionTime = timeElapsed(createdAt);
  const modifiedTime = timeElapsed(editAt);

  if (expecting) {
    console.log("FormatText if");
    hljs.highlightAll();
  }

  // setTimeout(() => {
  //   console.log("FormatText");
  //   hljs.highlightAll();
  // }, 3000);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h1 className={cx("title")}>{title}</h1>
        <div className={cx("info")}>
          <div className={cx("user")}>
            <img src={user.avatar} alt={user.username} />
            <span className={cx("username")}>{user.username}</span>
          </div>

          <span>Asked {questionTime}</span>
          <span>Modified {modifiedTime}</span>
          <span>Viewed {viewed} times</span>
        </div>
      </div>
      <div className={cx("question")}>
        <div className={cx("action")}>
          <Tippy content="Upvote">
            <div>
              <Button
                text
                licon
                leftIcon={
                  <lord-icon
                    src="https://cdn.lordicon.com/xsdtfyne.json"
                    trigger="hover"
                    colors="primary:#030e12"
                    state="hover-2"
                    style={{ width: "250", height: "250" }}
                  ></lord-icon>
                }
              ></Button>
            </div>
          </Tippy>
          <Tippy content="Upvote">
            <div>
              <Button
                text
                licon
                leftIcon={
                  <lord-icon
                    src="https://cdn.lordicon.com/rxufjlal.json"
                    trigger="hover"
                    colors="primary:#030e12"
                    state="hover-2"
                    style={{ width: "250", height: "250" }}
                  ></lord-icon>
                }
              ></Button>
            </div>
          </Tippy>
        </div>
        <div className={cx("content")}>
          <div className={cx("question-content")}>
            <div className={cx("problem")}>{parse(problem)}</div>
            <div className={cx("expecting")}>{parse(expecting)}</div>
          </div>
          <div className={cx("tags")}>
            {tags.map((tag, index) => (
              <Button key={index} text small className={cx("tag")}>
                #{tag}
              </Button>
            ))}
          </div>
        </div>

        {console.log("DOM")}
      </div>

      <div className={cx("comment")}>
        <span className={cx("user")}>đasadsadas:</span>
        <span className={cx("content")}>
          As far as I know window.onload waits for image loads too. I see the
          question is from 2012, maybe old browsers worked differently, I am not
          sure. If backward compatibility is important to you, then you can
          always add a script, which checks whether your images are loaded
          before you continue.
        </span>
      </div>
      <div className={cx("answer")}></div>
    </div>
  );
};

export default Question;
