import classNames from "classnames/bind";
import { useEffect } from "react";
import { motion } from "framer-motion";

import style from "./Works.module.scss";

function Works() {
  const cx = classNames.bind(style);

  useEffect(() => {
    document.title = "ITSocial :: Works";
  }, []);

  return (
    <motion.div
      className={cx("wrapper")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cx("top-nav")}>
        <h1>Works</h1>
      </div>
    </motion.div>
  );
}

export default Works;
