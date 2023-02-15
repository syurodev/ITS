import classNames from "classnames/bind";

import Header from "~/components/layouts/components/Header";
import Footer from "~/components/layouts/components/Footer";
import Sidebar from "./Sidebar";
import style from "./DefaultLayout.module.scss";

const cx = classNames.bind(style);

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <div className={cx("wrapper")}>
        <div className={cx("container")}>
          <Sidebar />
          <div className={cx("content")}>{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
