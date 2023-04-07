import classNames from "classnames/bind";
import { motion } from "framer-motion";
import { memo } from "react";

import style from "./Modal.module.scss";
import Button from "../Button";

function Modal({ closeModal, children }) {
  const cx = classNames.bind(style);
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={cx("wrapper")}
    >
      <div className={cx("container")}>
        <div className={cx("close-btn")}>
          <Button
            text
            onlyicon
            nmw
            onClick={() => closeModal(false)}
            leftIcon={
              <lord-icon
                src="https://cdn.lordicon.com/nhfyhmlt.json"
                trigger="hover"
                colors="primary:#030e12"
                state="hover-3"
                style={{ width: "250", height: "250" }}
              ></lord-icon>
            }
          />
        </div>
        <div className={cx("content")}>{children}</div>
      </div>
    </motion.div>
  );
}

export default memo(Modal);
