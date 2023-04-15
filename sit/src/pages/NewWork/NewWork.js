import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import style from "./NewWork.module.scss";
import CustomTagsInput from "~/components/TagsInput";
import routesConfig from "~/config/router";
import Button from "~/components/Button/Button";
import * as workServices from "~/services/workServices";

function NewWork() {
  const cx = classNames.bind(style);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [detail, setDetail] = useState("");
  const [upto, setUpto] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [tags, setTags] = useState([]);

  const combineValues = () => {
    if (upto.includes("-")) {
      const [low, high] = upto.split("-");
      if (
        !isNaN(low.trim()) &&
        low.trim() > 0 &&
        !isNaN(high.trim()) &&
        high.trim() > 0 &&
        low.trim() < high.trim()
      ) {
        return `${low.trim()} ${currency} - ${high.trim()} ${currency}`;
      }
    } else if (!isNaN(upto) && upto > 0) {
      return `${upto.trim()} ${currency}`;
    }
    return "";
  };

  const handleSubmit = async () => {
    const salary = await combineValues();
    if (
      title.trim() !== "" &&
      detail.trim() !== "" &&
      position.trim() !== "" &&
      tags.length > 0
    ) {
      if (salary.trim() !== "") {
        const newTags = [];
        // eslint-disable-next-line array-callback-return
        tags.map((tag) => {
          newTags.push(tag.text);
        });

        const bodyJSON = {
          title: title,
          position: position,
          detail: detail,
          salary: salary,
          tags: JSON.stringify(newTags),
          user: currentUser._id,
        };

        const fetchApi = async () => {
          const result = await workServices.create(bodyJSON);

          if (result.status) {
            navigate(routesConfig.works);
          }
        };
        fetchApi();
      } else {
        setError("Vui lòng nhập mức lương hợp lệ");
      }
    } else {
      setError("Hãy điền đầy đủ tất cả các trường");
    }
  };

  return (
    <motion.div
      className={cx("wrapper")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cx("container")}>
        <div className={cx("head-title")}>
          <h1>Tạo công việc</h1>
        </div>
        <div className={cx("add-work-container")}>
          <div className={cx("work-options")}>
            <div className={cx("work-option")}>
              <div className={cx("work-title")}>
                <label htmlFor="title">
                  <h2 className={cx("title")}>Tiêu đề</h2>
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
                  <h2 className={cx("title")}>
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
              <div className={cx("work-detail")}>
                <label htmlFor="detail">
                  <h2 className={cx("title")}>
                    Chi tiết công việc của bạn là gì?
                  </h2>
                  <small>Mô tả chi tiết những gì bạn yêu cầu</small>
                  <input
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    type="text"
                    placeholder="e.g thông thạo react..."
                    id="detail"
                    className={cx("input")}
                    onFocus={() => setError("")}
                  />
                </label>
              </div>
            </div>

            <div className={cx("work-option")}>
              <div className={cx("work-upto")}>
                <label htmlFor="upto">
                  <h2 className={cx("title")}>Mức lương</h2>
                  <small>Nhập mức lương cho công việc của bạn</small>
                  <div className={cx("upto-input")}>
                    <input
                      value={upto}
                      onChange={(e) => setUpto(e.target.value)}
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
            <Button outline to={routesConfig.works}>
              Huỷ
            </Button>
            <Button primary onClick={handleSubmit}>
              Tạo công việc
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NewWork;
