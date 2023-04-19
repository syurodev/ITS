import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faAngleDown,
  faAngleUp,
  faEye,
  faCrosshairs,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import AvatarEditor from "react-avatar-editor";
import { easeIn, motion } from "framer-motion";
import parse from "html-react-parser";

import * as userServices from "~/services/authServices";
import style from "./Profile.module.scss";
import Image from "~/components/Image";
import formatDate from "~/future/formatDate";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import ChangeUserInfo from "./ChangeUserInfo";
import Prism from "~/future/prism";
import "~/future/prism-laserwave.css";
import WorkDetail from "~/components/WorkDetail";

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
  const [openWorkDetail, setOpenWorkDetail] = useState(false);
  const [workData, setWorkData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "ITSocial :: Profile";
  }, []);

  ///get profile
  const fetchApi = async () => {
    setIsLoading(true);
    const result = await userServices.profile(userId);
    setUserData(result);
    setAvatar(result.user.avatar);

    const storedUserId = localStorage.getItem("itsSession");
    const currentUserId = JSON.parse(storedUserId);
    setAuth(userId && userId === currentUserId?._id);
    setIsLoading(false);
  };

  useEffect(() => {
    Prism.highlightAll();
  }, [userData]);

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handelOpenWorkDetail = (work) => {
    setOpenWorkDetail(true);
    setWorkData(work);
  };

  return (
    <motion.div
      className={cx("wrapper")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: easeIn }}
    >
      {isLoading ? (
        <div className={cx("is-loading")}>
          <lord-icon
            src="https://cdn.lordicon.com/ymrqtsej.json"
            trigger="loop"
            delay="0"
            style={{ width: "250", height: "250" }}
          ></lord-icon>
        </div>
      ) : (
        userData.user && (
          <div className={cx("container")}>
            <div className={cx("info")}>
              {auth && (
                <div className={cx("edit-profile-icon")}>
                  <Button
                    onClick={() => setChangeUserInfo(true)}
                    text
                    small
                    nmw
                    leftIcon={
                      <lord-icon
                        src="https://cdn.lordicon.com/hwuyodym.json"
                        trigger="hover"
                        colors="primary:#030e12"
                        state="hover-1"
                        style={{ width: "30", height: "30" }}
                      ></lord-icon>
                    }
                  ></Button>
                </div>
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
                  <p className={cx("user-name")}>
                    {userData.user.role === 1
                      ? userData.user.username || "unspecified work"
                      : userData.user.company}
                  </p>
                  <p className={cx("job")}>
                    {userData.user.role === 1
                      ? userData.user.job || "unspecified work"
                      : userData.user.username}
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
                  {userData.user.role === 1 ? (
                    <div>
                      <p className={cx("title")}>Reputation Score</p>
                      <p className={cx("reputation-score")}>
                        {userData.user.reputationScore}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className={cx("title")}>Address</p>
                      <p>{userData.user.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={cx("activate")}>
              {userData.user?.description && (
                <div className={cx("company-description")}>
                  <h2 className={cx("big-title")}>About</h2>
                  <div className={cx("content")}>
                    {parse(userData.user.description)}
                  </div>
                </div>
              )}

              {userData.user.role === 1 && (
                <div className={cx("top-tags")}>
                  <h2 className={cx("big-title")}>Top tags</h2>
                  <div className={cx("content")}>
                    {userData.tags && userData.tags.length > 0 ? (
                      userData.tags.map((tag, index) => {
                        return (
                          <div key={index} className={cx("tag")}>
                            <Link to={`/${tag.name}/${userId}`}>
                              <span className={cx("tag-name")}>
                                #{tag.name}
                              </span>
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
              )}

              {userData.user.role === 1 && (
                <div className={cx("top-posts")}>
                  <div className={cx("header")}>
                    <h2 className={cx("big-title")}>Top posts</h2>
                    <Link
                      to={`/questions/user/${userId}`}
                      className={cx("see-more")}
                    >
                      See more
                    </Link>
                  </div>
                  <div className={cx("content")}>
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
              )}

              {userData.user.role === 2 && (
                <div className={cx("works")}>
                  <div className={cx("header")}>
                    <h2 className={cx("big-title")}>Works</h2>
                    <Link
                      to={`/works/user/${userId}`}
                      className={cx("see-more")}
                    >
                      See more
                    </Link>
                  </div>
                  <div className={cx("work-list")}>
                    {userData.works && userData.works.length > 0 ? (
                      userData.works.map((work) => {
                        const date = formatDate(work.createdAt);

                        return (
                          <div key={work._id} className={cx("content")}>
                            <div className={cx("work")}>
                              <div className={cx("detail")}>
                                <span
                                  className={cx("title")}
                                  onClick={() => handelOpenWorkDetail(work)}
                                >
                                  {work.title}
                                </span>

                                <div className={cx("more")}>
                                  <div className={cx("position")}>
                                    <FontAwesomeIcon icon={faCrosshairs} />
                                    <span className={cx("text")}>
                                      {work.position}
                                    </span>
                                  </div>
                                  <div className={cx("salary")}>
                                    <FontAwesomeIcon icon={faMoneyBill} />
                                    <span className={cx("text")}>
                                      {work.salary}
                                    </span>
                                  </div>
                                  <div className={cx("tags")}>
                                    {JSON.parse(work.tags).map((tag, index) => (
                                      <Link key={index} to={`/works/${tag}`}>
                                        <span className={cx("tag-name")}>
                                          #{tag}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <span className={cx("date-post")}>{date}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className={cx("no-work")}>
                        <span>Không có công việc</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                        width={300}
                        height={300}
                        border={50}
                        color={[255, 255, 255, 0.6]}
                        scale={zoom}
                        className="avatar-editor"
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
            {openWorkDetail && (
              <Modal closeModal={setOpenWorkDetail}>
                <WorkDetail
                  data={workData}
                  auth={auth}
                  closeModal={setOpenWorkDetail}
                />
              </Modal>
            )}
          </div>
        )
      )}
    </motion.div>
  );
}

export default Profile;
