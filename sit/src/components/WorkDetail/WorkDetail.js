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

function WorkDetail({ data, auth, closeModal, getWorks }) {
  const cx = classNames.bind(style);
  const [workAuth, setWorkAuth] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);

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
          <span>{data.salary}</span>
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
    </div>
  );
}

export default WorkDetail;
