import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import parse from "html-react-parser";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import style from "./Comment.module.scss";
import Button from "~/components/Button";
import Tiptap from "~/components/TiptapEditor";
import * as commentServices from "~/services/commentServices";
import routesConfig from "~/config/router";

function Comment({ id, currentUser = [], type = "question", userRole = 1 }) {
  const cx = classNames.bind(style);
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [noCommennt, setNoCommennt] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  //fetch api
  useEffect(() => {
    const fetchApi = async () => {
      const result = await commentServices.getComments(id);
      if (result.length === 0) {
        setNoCommennt(true);
      } else {
        setComments(result);
        setNoCommennt(false);
      }
    };
    fetchApi();
  }, [commentCount, id]);

  useEffect(() => {
    if (newComment.trim() !== "") {
      setError("");
    }
  }, [newComment]);

  const handleAddComment = () => {
    if (Object.keys(currentUser).length !== 0) {
      if (!showCommentEditor) {
        setShowCommentEditor(true);
      } else if (newComment.trim() === "") {
        setError("Nội dung bình luận không được bỏ trống");
      } else {
        const fetchApi = async () => {
          if (type === "question") {
            const commentData = {
              question_id: id,
              comment: newComment,
              user: currentUser._id,
            };

            const result = await commentServices.addCommentQuestion(
              commentData
            );
            if (result.status) {
              setCommentCount(commentCount + 1);
              setShowCommentEditor(false);
              setNewComment("");
            }
          } else if (type === "answer") {
            const commentData = {
              answer_id: id,
              comment: newComment,
              user: currentUser._id,
            };

            const result = await commentServices.addCommentAnswer(commentData);
            setComments([result.data, ...comments]);
            setShowCommentEditor(false);
            setNewComment("");
          }
        };
        fetchApi();
      }
    } else {
      navigate(routesConfig.login);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("comment")}>
        <div className={cx("title")}>
          <span>Comments</span>
        </div>
        {!noCommennt ? (
          comments.map((comment) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className={cx("content")}
                key={comment._id}
              >
                <Link
                  className={cx("user-comment")}
                  to={`/profile/${comment.user._id}`}
                >
                  <span>{comment.user.username} </span>
                  <span className={cx("score")}>
                    {comment.user.reputationScore}{" "}
                  </span>
                  :
                </Link>
                <span className={cx("comment-content")}>
                  {parse(comment.comment)}
                </span>
              </motion.div>
            );
          })
        ) : (
          <div className={cx("no-item")}>
            <span>No Comment</span>
          </div>
        )}

        <div className={cx("btns")}>
          <span
            className={cx("error", "hide", {
              show: showCommentEditor,
            })}
          >
            {error}
          </span>
          <div
            className={cx("cancel-btn", "hide", {
              show: showCommentEditor,
            })}
          >
            <Button small outline onClick={() => setShowCommentEditor(false)}>
              Cancel
            </Button>
          </div>
          {userRole !== 2 && (
            <Button small primary onClick={handleAddComment}>
              {showCommentEditor ? "Add" : "Add a comment"}
            </Button>
          )}
        </div>

        <div
          className={cx("hide", {
            show: showCommentEditor,
          })}
        >
          <Tiptap setState={setNewComment} />
        </div>
      </div>
    </div>
  );
}

export default Comment;
