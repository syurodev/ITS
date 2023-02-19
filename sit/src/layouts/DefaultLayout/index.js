import classNames from "classnames/bind";

import Header from "~/layouts/components/Header";
import Footer from "~/layouts/components/Footer";
import Sidebar from "./Sidebar";
import style from "./DefaultLayout.module.scss";

const cx = classNames.bind(style);

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <div className={cx("wrapper")}>
        <Sidebar />
        <div className={cx("content")}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
