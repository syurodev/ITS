import React from "react";
import classNames from "classnames/bind";

import style from "./Home.module.scss";
import Button from "~/components/Button";

const cx = classNames.bind(style);

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Button primary rounded small>
        Log in to web
      </Button>
      <Button outline rounded small>
        Log in to web
      </Button>
    </div>
  );
};

export default Home;
