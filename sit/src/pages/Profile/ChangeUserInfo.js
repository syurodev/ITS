import { useState } from "react";
import classNames from "classnames/bind";

import style from "./Profile.module.scss";
import Button from "~/components/Button";
import * as userServices from "~/services/authServices";

function ChangeUserInfo({ data, closeModal, fetchApiData }) {
  const cx = classNames.bind(style);
  const [username, setUsername] = useState(data.username);
  const [job, setJob] = useState(data.job || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [email, setEmail] = useState(data.email || "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (email.trim() !== "") {
      if (reg.test(email) === false) {
        setError("Invalid email");
        return;
      }
    }

    if (username.trim().length < 8) {
      setError("Username must be at least 8 characters");
      return;
    }

    const userData = {
      id: data._id,
      username,
      job,
      phone,
      email,
    };

    const fetchApi = async () => {
      const result = await userServices.changeUserInfo(userData);
      if (result.status === false) {
        setError(result.message);
      } else {
        fetchApiData();
        closeModal(false);
      }
    };
    fetchApi();
  };

  return (
    <div className={cx("change-info-modal")}>
      <h1 className={cx("modal-title")}>Change User Info</h1>
      {error && <span className={cx("error-message")}>{error}</span>}
      <label className={cx("box-input")}>
        <span className={cx("title")}>Username: </span>
        <input
          spellCheck="false"
          className={cx("input")}
          type="text"
          value={username}
          onFocus={() => setError("")}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className={cx("box-input")}>
        <span className={cx("title")}>Công việc: </span>
        <input
          spellCheck="false"
          className={cx("input")}
          type="text"
          value={job}
          onFocus={() => setError("")}
          onChange={(e) => setJob(e.target.value)}
        />
      </label>
      <label className={cx("box-input")}>
        <span className={cx("title")}>Phone: </span>
        <input
          spellCheck="false"
          className={cx("input")}
          type="text"
          value={phone}
          onFocus={() => setError("")}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className={cx("box-input")}>
        <span className={cx("title")}>Email: </span>
        <input
          spellCheck="false"
          className={cx("input")}
          type="text"
          value={email}
          onFocus={() => setError("")}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <div className={cx("btns")}>
        <Button small primary onClick={handleSubmit}>
          Đổi
        </Button>
        <Button small outline onClick={() => closeModal(false)}>
          Huỷ
        </Button>
      </div>
    </div>
  );
}

export default ChangeUserInfo;
