import Header from "~/layouts/components/Header";
import Footer from "~/layouts/components/Footer";

function NoSidebar({ children }) {
  return (
    <div>
      <Header />
      <div className="container">
        <div className="content">{children}</div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default NoSidebar;
