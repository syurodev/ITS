import { useState } from "react";
import classNames from "classnames/bind";

import style from "./Profile.module.scss";
import Button from "~/components/Button";
import * as userServices from "~/services/authServices";
import Tiptap from "~/components/TiptapEditor";
import Modal from "~/components/Modal";

function ChangeUserInfo({ data, closeModal, fetchApiData }) {
  const cx = classNames.bind(style);
  const [username, setUsername] = useState(data.username);
  const [job, setJob] = useState(data.job || "");
  const [company, setCompany] = useState(data.company || "");
  const [address, setAddress] = useState(data.address || "");
  const [description, setDescription] = useState(data.description || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [email, setEmail] = useState(data.email || "");
  const [error, setError] = useState("");

  const [oldPass, setOldPass] = useState("");
  const [oldPassError, setOldPassError] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassError, setNewPassError] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [reNewPassError, setReNewPassError] = useState("");
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [changePasswordSuccessfuly, setChangePasswordSuccessfuly] =
    useState(false);

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
      company,
      address,
      description,
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

  const handleChangePassword = () => {
    if (newPass !== reNewPass) {
      setReNewPassError("Nhập lại mật khẩu không đúng");
      return;
    }

    if (newPass.length < 8) {
      setNewPassError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    const fetchApi = async () => {
      const req = {
        id: data._id,
        oldPass,
        newPass,
      };
      const result = await userServices.changePassword(req);

      if (!result.status) {
        setOldPassError(result.error);
      } else {
        setChangePasswordSuccessfuly(true);
        setChangePasswordModal(false);
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

      {data.role === 1 && (
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
      )}

      {data.role === 2 && (
        <label className={cx("box-input")}>
          <span className={cx("title")}>Tên doanh nghiệp: </span>
          <input
            spellCheck="false"
            className={cx("input")}
            type="text"
            value={company}
            onFocus={() => setError("")}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      )}

      <label className={cx("description")}>
        {data.role === 2 ? (
          <span className={cx("title")}>Về doanh nghiệp: </span>
        ) : (
          <span className={cx("title")}>Về bản thân: </span>
        )}
        <Tiptap
          setState={setDescription}
          setError={setError}
          content={description}
        />
      </label>

      {data.role === 2 && (
        <label className={cx("box-input")}>
          <span className={cx("title")}>Địa chỉ doanh nghiệp: </span>
          <input
            spellCheck="false"
            className={cx("input")}
            type="text"
            value={address}
            onFocus={() => setError("")}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      )}

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

      <label className={cx("box-input")}>
        <div
          style={{
            width: "fit-content",
            whiteSpace: "nowrap",
            marginRight: "25px",
          }}
        >
          <span className={cx("title")}>Mật khẩu: </span>
        </div>
        <Button
          small
          lightgray
          fwidth
          onClick={() => setChangePasswordModal(true)}
        >
          Đổi mật khẩu
        </Button>
      </label>

      <div className={cx("btns")}>
        <Button small primary onClick={handleSubmit}>
          Đổi
        </Button>
        <Button small outline onClick={() => closeModal(false)}>
          Huỷ
        </Button>
      </div>

      {changePasswordModal && (
        <Modal closeModal={setChangePasswordModal}>
          <div className={cx("change-password-modal")}>
            <h2>Đổi mật khẩu</h2>
            <label htmlFor="oldpass" className={cx("input")}>
              <span className={cx("title")}>Nhập mật khẩu cũ:</span>
              <input
                type="text"
                id="oldpass"
                placeholder="Nhập mật khẩu cũ"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className={cx({ error: oldPassError })}
              />
            </label>
            {oldPassError && (
              <span className={cx("error-mesg")}>{oldPassError}</span>
            )}

            <label htmlFor="newpass" className={cx("input")}>
              <span className={cx("title")}>Nhập mật khẩu mới:</span>
              <input
                type="text"
                id="newpass"
                placeholder="Nhập mật khẩu mới"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className={cx({ error: newPassError })}
                onFocus={() => setNewPassError("")}
              />
            </label>
            {newPassError && (
              <span className={cx("error-mesg")}>{newPassError}</span>
            )}

            <label htmlFor="renewpass" className={cx("input")}>
              <span className={cx("title")}>Nhập lại mật khẩu mới:</span>
              <input
                type="text"
                id="renewpass"
                placeholder="Nhập lại mật khẩu mới"
                value={reNewPass}
                onChange={(e) => setReNewPass(e.target.value)}
                className={cx({ error: reNewPassError })}
                onFocus={() => setReNewPassError("")}
              />
            </label>
            {reNewPassError && (
              <span className={cx("error-mesg")}>{reNewPassError}</span>
            )}

            <div className={cx("btns")}>
              <Button small primary onClick={handleChangePassword}>
                Đổi
              </Button>
              <Button
                small
                outline
                onClick={() => setChangePasswordModal(false)}
              >
                Huỷ
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {changePasswordSuccessfuly && (
        <Modal closeModal={setChangePasswordSuccessfuly}>
          <h3>Đổi mật khẩu thành công</h3>
        </Modal>
      )}
    </div>
  );
}

export default ChangeUserInfo;
