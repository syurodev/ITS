import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import classNames from "classnames/bind";

import * as userServices from "~/services/authServices";
import style from "./Profile.module.scss";
import Image from "~/components/Image";

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

  return (
    <div className={cx("wrapper")}>
      {userData.user && (
        <div className={cx("container")}>
          <div className={cx("info")}>
            <div className={cx("left")}>
              <Image
                src={userData.user.avatar}
                alt={userData.user.username}
                className={cx("avatar")}
              />
            </div>
            <div className={cx("right")}>
              <p>{userData.user.username}</p>
              <p>{userData.user.email}</p>
            </div>
          </div>
          <div className={cx("details")}></div>
        </div>
      )}
    </div>
  );
}

export default Profile;
