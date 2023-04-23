import classNames from "classnames/bind";
import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

import style from "./WorkDetail.module.scss";
import Button from "../Button/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import * as workServices from "~/services/workServices";
import CustomTagsInput from "~/components/TagsInput";
import Tiptap from "~/components/TiptapEditor";

function WorkDetail({ data, auth, closeModal, getWorks }) {
  const cx = classNames.bind(style);
  const outputArray = JSON.parse(data?.tags).map((item) => ({
    id: item,
    text: item,
  }));
  const [workAuth, setWorkAuth] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [editWork, setEditWork] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(data?.title || "");
  const [position, setPosition] = useState(data?.position || "");
  const [salary, setSalary] = useState(data?.salary || "");
  const [currency, setCurrency] = useState(data?.currency);
  const [description, setDescription] = useState(data?.description || "");
  const [tags, setTags] = useState(outputArray);
  const [editSuccessfully, setEditSuccessfully] = useState(false);

  useEffect(() => {
    if (typeof auth === "boolean") {
      setWorkAuth(auth);
    } else if (data?.user?._id === auth) {
      setWorkAuth(true);
    }
  }, [auth, data]);

  const handleDelete = () => {
    const fetchApi = async () => {
      // eslint-disable-next-line no-unused-vars
      const result = await workServices.deleteWork(data._id);

      setDeleteModal(false);
      closeModal(false);
      getWorks();
    };
    fetchApi();
  };

  const combineValues = () => {
    if (salary.includes("-")) {
      const [low, high] = salary.split("-");
      if (
        !isNaN(low.trim()) &&
        low.trim() > 0 &&
        !isNaN(high.trim()) &&
        high.trim() > 0 &&
        low.trim() < high.trim()
      ) {
        return salary;
      }
    } else if (!isNaN(salary) && salary > 0) {
      return salary;
    }
    return "";
  };

  const handleEdit = () => {
    const validateSalary = combineValues();

    if (validateSalary.trim() === "") {
      setError("Vui lòng nhập mức lương hợp lệ");
      return;
    }

    if (title.trim() !== "" && position.trim() !== "" && tags.length > 0) {
      const newTags = [];
      // eslint-disable-next-line array-callback-return
      tags.map((tag) => {
        newTags.push(tag.text);
      });

      const bodyJSON = {
        id: data._id,
        title: title,
        position: position,
        validateSalary: salary,
        currency: currency,
        tags: JSON.stringify(newTags),
      };

      const fetchApi = async () => {
        // eslint-disable-next-line no-unused-vars
        const result = await workServices.editWork(bodyJSON);
        setEditSuccessfully(true);
        setEditWork(false);
        closeModal(false);
      };
      fetchApi();
    } else {
      setError("Hãy điền đầy đủ tất cả các trường");
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("title")}>
        <Link to={`/profile/${data.user._id}`} className={cx("company")}>
          {data.user.company}
        </Link>
        <h1>{data.title}</h1>
      </div>
      <div className={cx("more")}>
        <div className={cx("position")}>
          <FontAwesomeIcon icon={faCrosshairs} />
          <span>{data.position}</span>
        </div>
        <div className={cx("salary")}>
          <FontAwesomeIcon icon={faMoneyBill} />
          <span>{`${data.salary} ${data.currency}`}</span>
        </div>
      </div>

      <div className={cx("break")}>
        <span>______________________</span>
      </div>

      <div className={cx("description")}>
        {data?.description ? (
          parse(data?.description)
        ) : (
          <div className={cx("no-description")}>
            <span>Không có mô tả công việc</span>
          </div>
        )}
      </div>

      <div className={cx("btns")}>
        {workAuth && (
          <Button lightgray onClick={() => setEditWork(true)}>
            Sửa
          </Button>
        )}

        {!workAuth && (
          <Button primary onClick={() => setOpenContactModal(true)}>
            Liên hệ
          </Button>
        )}

        {workAuth && (
          <Button danger onClick={() => setDeleteModal(true)}>
            Xoá
          </Button>
        )}

        <Button outline onClick={() => closeModal(false)}>
          Đóng
        </Button>
      </div>

      {openContactModal && (
        <Modal closeModal={setOpenContactModal}>
          <>
            <div className={cx("title")}>
              <Link to={`/profile/${data.user._id}`} className={cx("company")}>
                {data.user.company}
              </Link>
            </div>
            <div className={cx("contact")}>
              <span>Email: {data.user?.email}</span>
              <span>Phone: {data.user?.phone}</span>
              <span>Address: {data.user?.address}</span>
            </div>
          </>
        </Modal>
      )}

      {deleteModal && (
        <Modal closeModal={setDeleteModal}>
          <>
            <h1>BẠN CÓ CHẮC MUỐN XOÁ CÔNG VIỆC NÀY</h1>

            <div className={cx("btns")}>
              <Button danger onClick={handleDelete}>
                Xoá
              </Button>
              <Button outline onClick={() => setDeleteModal(false)}>
                Huỷ
              </Button>
            </div>
          </>
        </Modal>
      )}

      {editWork && (
        <Modal closeModal={setEditWork}>
          <div className={cx("edit-work")}>
            <div className={cx("head-title")}>
              <h1>Chỉnh sửa công việc</h1>
            </div>
            <div className={cx("add-work-container")}>
              <div className={cx("work-options")}>
                <div className={cx("work-option")}>
                  <div className={cx("work-title")}>
                    <label htmlFor="title">
                      <h2 className={cx("edit-title")}>Tiêu đề</h2>
                      <small>Mô tả ngắn gọn công việc của bạn</small>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Nhập tiêu đề công việc"
                        id="title"
                        className={cx("input")}
                        onFocus={() => setError("")}
                      />
                    </label>
                  </div>
                </div>

                <div className={cx("work-option")}>
                  <div className={cx("work-position")}>
                    <label htmlFor="position">
                      <h2 className={cx("edit-title")}>
                        Vị trí công việc của bạn là gì?
                      </h2>
                      <small>Nhập vị trí công việc của bạn</small>
                      <input
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        type="text"
                        placeholder="e.g lập trình viên backend"
                        id="position"
                        className={cx("input")}
                        onFocus={() => setError("")}
                      />
                    </label>
                  </div>
                </div>

                <div className={cx("work-option")}>
                  <div className={cx("work-upto")}>
                    <label htmlFor="upto">
                      <h2 className={cx("edit-title")}>Mức lương</h2>
                      <small>Nhập mức lương cho công việc của bạn</small>
                      <div className={cx("upto-input")}>
                        <input
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          type="text"
                          placeholder="e.g. 1000 - 2000 or 1500"
                          id="upto"
                          className={cx("input")}
                          onFocus={() => setError("")}
                        />
                        <select
                          name="currency"
                          id="currency"
                          className={cx("currency")}
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <option value="VND">VND</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </label>
                  </div>
                </div>

                <div className={cx("work-option")}>
                  <div className={cx("work-description")}>
                    <label htmlFor="description">
                      <h2 className={cx("edit-title")}>Mô tả công việc</h2>
                      <small>Mô tả chi tiết công việc của bạn</small>
                      <Tiptap
                        setState={setDescription}
                        setError={setError}
                        content={description}
                      />
                    </label>
                  </div>
                </div>

                <div className={cx("work-option")}>
                  <div className={cx("work-tags")}>
                    <CustomTagsInput tags={tags} setTags={setTags} />
                  </div>
                </div>

                {error && (
                  <div className={cx("error")}>
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className={cx("btns")}>
                <Button outline onClick={() => setEditWork(false)}>
                  Huỷ
                </Button>
                <Button primary onClick={handleEdit}>
                  Sửa
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {editSuccessfully && (
        <Modal closeModal={setEditSuccessfully}>
          <h3>Thay đổi thành công</h3>
        </Modal>
      )}
    </div>
  );
}

export default WorkDetail;
