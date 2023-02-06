import Header from "~/components/layouts/components/Header";
import Footer from "~/components/layouts/components/Footer";
import Sidebar from "./Sidebar";

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="container">
        <Sidebar />
        <div className="content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
