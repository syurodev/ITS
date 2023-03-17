import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import parse from "html-react-parser";
import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Prism from "~/future/prism";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import * as userServices from "~/services/authServices";
import routesConfig from "~/config/router";
import style from "./Question.module.scss";
import timeElapsed from "~/future/timeElapsed";
import Button from "~/components/Button";
import Comment from "./components/Comment";
import Answers from "./components/Answers";
import "~/future/prism-laserwave.css";
import * as questionServices from "~/services/questionServices";
import * as authServices from "~/services/authServices";
import { bookmark } from "~/pages/Auth/authSlice";

const Question = () => {
  const cx = classNames.bind(style);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { idQuestion } = useParams();

  const [session, setSession] = useState(false);

  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  let bookmarks = useSelector((state) => {
    return state.user.bookmark;
  });

  // DATA
  const [title, setTitle] = useState("");
  const [viewed, setViewed] = useState(0);
  const [createdAt, setCreatedAt] = useState();
  const [editAt, setEditAt] = useState();
  const [problem, setProblem] = useState("");
  const [expecting, setExpecting] = useState("");
  const [solved, setSolved] = useState(false);
  const [user, setUser] = useState({});
  const [tags, setTags] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [bookmarkIconColor, setBookmarkIconColor] = useState("030e12");

  // VOTE
  const [upvote, setUpvote] = useState([]);
  const [voteNumber, setVoteNumber] = useState(0);
  const [downvote, setDownvote] = useState([]);
  const [upvoteIconColor, setUpvoteIconColor] = useState("#030e12");
  const [downvoteIconColor, setDownvoteIconColor] = useState("#030e12");

  // COMMENT
  const [comments, setComments] = useState([]);

  const [auth, setAuth] = useState(false);

  //CHECK SESSION
  useEffect(() => {
    if (Object.keys(currentUser).length === 0) {
      const userSession = localStorage.getItem("itsSession");
      if (userSession) {
        setSession(true);
      } else {
        setSession(false);
      }
    } else {
      setSession(true);
    }
  }, []);

  //CHECK AUTH
  useEffect(() => {
    if (currentUser._id === user._id) {
      setAuth(true);
    }
  }, [user._id, currentUser._id]);

  //CHECK USER BOOKMARK
  useEffect(() => {
    if (session) {
      if (Object.keys(bookmarks).length === 0 || userBookmarks.length === 0) {
        const getData = async () => {
          let sessionStorageBookmarks = sessionStorage.getItem("bookmark");
          if (!sessionStorageBookmarks) {
            const result = await userServices.getBookmark(currentUser._id);
            setUserBookmarks(result.data);
            sessionStorage.setItem("bookmark", JSON.stringify(result.data));
          } else {
            setUserBookmarks(JSON.parse(sessionStorageBookmarks));
          }
        };
        getData();
      } else {
        setUserBookmarks(bookmarks);
      }
    } else {
      setUserBookmarks([]);
    }
  }, [session]);

  //FETCH API GET QUESTION DETAIL
  useEffect(() => {
    const getQuestionDetail = async () => {
      const result = await questionServices.questionDetail(idQuestion);
      setTitle(result.title);
      setViewed(result.viewed);
      setCreatedAt(result.createdAt);
      setEditAt(result.editAt);
      setProblem(result.problem);
      setExpecting(result.expecting);
      setSolved(result.solved);
      setUser(result.user);
      setTags(JSON.parse(result.tags[0]));
      setComments(result.comments);
      setUpvote(result.upvote);
      setDownvote(result.downvote);
    };
    getQuestionDetail();
  }, [idQuestion]);

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
    if (userBookmarks.includes(idQuestion)) {
      setBookmarkIconColor("#ed7966");
    } else {
      setBookmarkIconColor("#030e12");
    }

    Prism.highlightAll();
  }, [upvote, downvote, problem, expecting, currentUser._id, userBookmarks]);

  //VOTE NUMBER
  useEffect(() => {
    setVoteNumber(upvote.length - downvote.length);
  }, [upvote.length, downvote.length]);

  // UNVOTE
  const handleUnvote = async () => {
    if (session) {
      const result = await questionServices.unvote(idQuestion, {
        user: currentUser._id,
        score: user._id,
      });
      setUpvote(result.data.upvote);
      setDownvote(result.data.downvote);
      setUpvoteIconColor("#030e12");
      setDownvoteIconColor("#030e12");
    }
  };

  //UPVOTE / DOWNVOTE
  const handleVote = async (type) => {
    if (session) {
      if (type === "upvote") {
        if (!upvote.includes(currentUser._id)) {
          const result = await questionServices.upvote(idQuestion, {
            user: currentUser._id,
            score: user._id,
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
          const result = await questionServices.downvote(idQuestion, {
            user: currentUser._id,
            score: user._id,
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

  //HANDEL BOOKMARK
  const handleBookmark = () => {
    if (session) {
      const queryData = {
        id: idQuestion,
        user: currentUser._id,
      };

      const fetchApi = async () => {
        const result = await authServices.addBookmark(queryData);
        setUserBookmarks(result.data);
        sessionStorage.setItem("bookmark", JSON.stringify(result.data));
        dispatch(bookmark(result.data));
      };
      fetchApi();
    } else {
      navigate(routesConfig.login);
    }
  };

  const questionTime = timeElapsed(createdAt);
  const modifiedTime = timeElapsed(editAt);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h1 className={cx("title")}>{title}</h1>
        <div className={cx("info")}>
          <Link to={`/profile/${user._id}`}>
            <div className={cx("user")}>
              <img src={user.avatar} alt={user.username} />
              <span className={cx("username")}>{user.username}</span>
            </div>
          </Link>
          <span>Asked {questionTime}</span>
          <span>Modified {modifiedTime}</span>
          <span>Viewed {viewed} times</span>
          {solved ? <span className={cx("solved")}>Solved</span> : <></>}
        </div>
      </div>

      {/* // QUESTION */}
      <div className={cx("question")}>
        <div className={cx("action")}>
          <Tippy content="Upvote" placement="left">
            <div>
              <Button
                text
                licon
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
                licon
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
          <Tippy content="Save to Bookmark" placement="left">
            <div>
              <Button
                text
                onlyicon
                leftIcon={
                  <lord-icon
                    src="https://cdn.lordicon.com/gigfpovs.json"
                    trigger="click"
                    colors={`primary:${bookmarkIconColor}`}
                    state="hover-1"
                    style={{ width: "250", height: "250" }}
                  ></lord-icon>
                }
                onClick={handleBookmark}
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
              <Button
                key={index}
                text
                small
                className={cx("tag")}
                to={`/${tag}`}
              >
                #{tag}
              </Button>
            ))}
          </div>

          {/* COMMENT */}
          <Comment data={comments} id={idQuestion} currentUser={currentUser} />
        </div>
      </div>

      {/* ANSWER */}
      <Answers questionId={idQuestion} auth={auth} />
    </div>
  );
};

export default Question;
