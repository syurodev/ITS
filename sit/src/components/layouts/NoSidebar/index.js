import Header from "~/components/layouts/components/Header";
import Footer from "~/components/layouts/components/Footer";

function NoSidebar({ children }) {
  return (
    <div>
      <Header />
      <div className="container">
        <div className="content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default NoSidebar;
