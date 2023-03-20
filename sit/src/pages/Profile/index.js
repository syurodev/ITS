import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faAngleDown,
  faAngleUp,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

import * as userServices from "~/services/authServices";
import style from "./Profile.module.scss";
import Image from "~/components/Image";
import formatDate from "~/future/formatDate";

function Profile() {
  const cx = classNames.bind(style);
  const { userId } = useParams();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await userServices.profile(userId);
      setUserData(result);
      console.log(result);
    };
    fetchApi();
  }, []);

  const memberFor = userData.user?.dateCreate
    ? formatDate(userData.user.dateCreate, "user")
    : userData.user
    ? "Loading..."
    : "";

  return (
    <div className={cx("wrapper")}>
      {userData.user && (
        <div className={cx("container")}>
          <div className={cx("info")}>
            <div className={cx("avatar")}>
              <span className={cx("edit-icon")}>
                <FontAwesomeIcon icon={faPencil} />
              </span>
              <span className={cx("edit-icon-bg")}></span>
              <Image src={userData.user.avatar} alt={userData.user.username} />
            </div>
            <div className={cx("details")}>
              <div>
                <p className={cx("user-name")}>{userData.user.username}</p>
                <p className={cx("job")}>
                  {userData.user.job || "unspecified work"}
                </p>
              </div>
              <div className={cx("content")}>
                <div>
                  <p className={cx("title")}>Email</p>
                  <p>{userData.user.email}</p>
                </div>
                <div>
                  <p className={cx("title")}>Phone Number</p>
                  <p>{userData.user.phone || "null"}</p>
                </div>
                <div>
                  <p className={cx("title")}>Member for</p>
                  <p>{memberFor}</p>
                </div>
                <div>
                  <p className={cx("title")}>Reputation Score</p>
                  <p>{userData.user.reputationScore}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("activate")}>
            <div className={cx("top-tags")}>
              <h2 className={cx("title")}>Top tags</h2>
              <div className={cx("tag-list")}>
                {userData.tags && userData.tags.length > 0 ? (
                  userData.tags.map((tag, index) => {
                    return (
                      <div key={index} className={cx("tag")}>
                        <Link to={`/${tag.name}/${userId}`}>
                          <span className={cx("tag-name")}>#{tag.name}</span>
                        </Link>
                        <span className={cx("count")}>
                          {tag.count}
                          <span className={cx("count-title")}> posts</span>
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span> No tag</span>
                )}
              </div>
            </div>
            <div className={cx("top-posts")}>
              <h2 className={cx("title")}>Top posts</h2>
              <div className={cx("post-list")}>
                {userData.questions && userData.questions.length > 0 ? (
                  userData.questions.map((question, index) => {
                    const date = formatDate(question.createdAt);

                    return (
                      <div key={index} className={cx("post")}>
                        <div className={cx("content")}>
                          <Link to={`/question/${question._id}`}>
                            <span className={cx("title")}>
                              {question.title}
                            </span>
                          </Link>

                          <span className={cx("date-post")}>{date}</span>
                        </div>
                        <div className={cx("detail")}>
                          <div className={cx("detail-item")}>
                            <FontAwesomeIcon icon={faAngleUp} />
                            <span>{question.upvote.length}</span>
                          </div>
                          <div className={cx("detail-item")}>
                            <FontAwesomeIcon icon={faAngleDown} />{" "}
                            <samp>{question.downvote.length}</samp>
                          </div>
                          <div className={cx("detail-item")}>
                            <FontAwesomeIcon icon={faEye} />
                            <span>{question.viewed}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span> No post</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
