import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import parse from "html-react-parser";

import style from "./Comment.module.scss";
import Button from "~/components/Button";
import Tiptap from "~/future/tiptapEditor";
import * as commentServices from "~/services/commentServices";

const cx = classNames.bind(style);

function Comment({ data = [], id, currentUser = [], type = "question" }) {
  const [comments, setComments] = useState([]);
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setComments(data);
  }, [data]);

  useEffect(() => {
    if (newComment.trim() !== "") {
      setError("");
    }
  }, [newComment]);

  const handelAddComment = () => {
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
            user: currentUser,
          };

          const result = await commentServices.addCommentQuestion(commentData);
          setComments([result.data, ...comments]);
          setShowCommentEditor(false);
          setNewComment("");
        } else if (type === "answer") {
          const commentData = {
            answer_id: id,
            comment: newComment,
            user: currentUser,
          };

          const result = await commentServices.addCommentAnswer(commentData);
          setComments([result.data, ...comments]);
          setShowCommentEditor(false);
          setNewComment("");
        }
      };
      fetchApi();
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("comment")}>
        <div className={cx("title")}>
          <span>Comments</span>
        </div>
        {comments.map((comment) => {
          return (
            <div className={cx("content")} key={comment._id}>
              <span className={cx("user-comment")}>
                <span>{comment.user.username} </span>
                <span className={cx("score")}>
                  {comment.user.reputationScore}{" "}
                </span>
                :
              </span>
              <span className={cx("comment-content")}>
                {parse(comment.comment)}
              </span>
            </div>
          );
        })}

        <div className={cx("btn")}>
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
          <Button small primary onClick={handelAddComment}>
            {showCommentEditor ? "Add" : "Add a comment"}
          </Button>
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
