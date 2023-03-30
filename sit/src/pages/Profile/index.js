import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faAngleDown,
  faAngleUp,
  faEye,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import AvatarEditor from "react-avatar-editor";

import * as userServices from "~/services/authServices";
import style from "./Profile.module.scss";
import Image from "~/components/Image";
import formatDate from "~/future/formatDate";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import ChangeUserInfo from "./ChangeUserInfo";

function Profile() {
  const cx = classNames.bind(style);
  const { userId } = useParams();
  const [userData, setUserData] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [changeAvatarModal, setChangeAvatarModal] = useState(false);
  const [changeUserInfo, setChangeUserInfo] = useState(false);
  const [newAvatarName, setNewAvatarName] = useState("");
  const [newAvatarPreview, setNewAvatarPreview] = useState("");
  const editorRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [auth, setAuth] = useState(false);

  const fetchApi = async () => {
    const result = await userServices.profile(userId);
    setUserData(result);
    setAvatar(result.user.avatar);

    const storedUserId = localStorage.getItem("itsSession");
    const currentUserId = JSON.parse(storedUserId);
    setAuth(userId && userId === currentUserId?._id);
  };

  useEffect(() => {
    fetchApi();
  }, [userId]);

  const memberFor = userData.user?.dateCreate
    ? formatDate(userData.user.dateCreate, "user")
    : userData.user
    ? "Loading..."
    : "";

  const handleChooseAvatar = (e) => {
    const newImage = e.target.files[0];
    setNewAvatarPreview(URL.createObjectURL(newImage));
  };

  const handleChangeAvatar = () => {
    const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
    const fetchApi = async () => {
      const result = await userServices.changeAvatar({
        avatar: canvas,
        userId,
      });
      if (result.status === true) {
        setChangeAvatarModal(false);
        setAvatar(canvas);
      }
    };
    fetchApi();
  };

  return (
    <div className={cx("wrapper")}>
      {userData.user && (
        <div className={cx("container")}>
          <div className={cx("info")}>
            {auth && (
              <FontAwesomeIcon
                className={cx("edit-profile-icon")}
                icon={faEllipsis}
                onClick={() => setChangeUserInfo(true)}
              />
            )}
            <div className={cx("avatar")}>
              {auth && (
                <div>
                  <span
                    className={cx("edit-icon")}
                    onClick={() => setChangeAvatarModal(true)}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </span>
                  <span className={cx("edit-icon-bg")}></span>
                </div>
              )}
              <Image src={avatar} alt={userData.user.username} />
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
                  <p className={cx("reputation-score")}>
                    {userData.user.reputationScore}
                  </p>
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
          {changeAvatarModal && (
            <Modal closeModal={setChangeAvatarModal}>
              <div className={cx("change-avatar-modal")}>
                <p className={cx("change-avatar-title")}>Change Avatar</p>
                <div className={cx("avatar-preview")}>
                  {newAvatarPreview ? (
                    <AvatarEditor
                      ref={editorRef}
                      image={newAvatarPreview}
                      width={350}
                      height={350}
                      border={50}
                      color={[255, 255, 255, 0.6]}
                      scale={zoom}
                    />
                  ) : (
                    <Image src={avatar} alt={userData.user.username} />
                  )}
                </div>

                {newAvatarPreview && (
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                  />
                )}

                <label
                  className={cx("choose-file-btn", {
                    choosed: !!newAvatarPreview,
                  })}
                >
                  <span className={cx("btn-title")}>Choose new avatar</span>
                  <span className={cx("btn-sub-title")}>
                    {!!newAvatarName ? newAvatarName : "click to select file"}
                  </span>
                  <input
                    type="file"
                    onChange={handleChooseAvatar}
                    accept="image/png, image/jpeg"
                  />
                </label>

                <div className={cx("btns")}>
                  <Button primary small onClick={handleChangeAvatar}>
                    Đổi
                  </Button>
                  <Button
                    outline
                    small
                    onClick={() => {
                      setChangeAvatarModal(false);
                      setNewAvatarName("");
                    }}
                  >
                    Huỷ
                  </Button>
                </div>
              </div>
            </Modal>
          )}

          {changeUserInfo && (
            <Modal closeModal={setChangeUserInfo}>
              <ChangeUserInfo
                data={userData.user}
                closeModal={setChangeUserInfo}
                fetchApiData={fetchApi}
              />
            </Modal>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
