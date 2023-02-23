import React from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import Button from "~/components/Button";
import style from "./Questions.module.scss";

const cx = classNames.bind(style);

const Home = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h1>Top Questions</h1>
      </div>
      <div className={cx("container")}>
        <div className={cx("item")}>
          <div className={cx("header")}>
            <Link className={cx("user")} to={"/"}>
              <div className={cx("avata")}>
                <img src="https://imgur.com/VBMMHox.jpg" alt="avata" />
              </div>
              <div className={cx("username")}>woninana</div>
              <Tippy content="Điểm hoạt động">
                <div className={cx("score")}>3000</div>
              </Tippy>
            </Link>

            <div className={cx("info")}>
              <span>0 vote</span>
              <span>0 answers</span>
              <span>2 views</span>
              <span>asked 7 secs ago</span>
            </div>
          </div>
          <div className={cx("title")}>
            <Link to={"/question"} className={cx("link")}>
              why i can't fetch data of preparationstep from
              https://rapidapi.com/apidojo/api/yummly2 it shows null in flutter
              help me please
            </Link>
          </div>
          <div className={cx("tags")}>
            <Button text small className={cx("tag")}>
              #flutter
            </Button>
            <Button text small className={cx("tag")}>
              #react
            </Button>
            <Button text small className={cx("tag")}>
              #jsx
            </Button>
          </div>
        </div>

        <div className={cx("item")}>
          <div className={cx("header")}>
            <Link className={cx("user")} to={"/"}>
              <div className={cx("avata")}>
                <img src="https://imgur.com/VBMMHox.jpg" alt="avata" />
              </div>
              <div className={cx("username")}>woninana</div>
              <Tippy content="Điểm hoạt động">
                <div className={cx("score")}>3000</div>
              </Tippy>
            </Link>

            <div className={cx("info")}>
              <span>0 vote</span>
              <span>0 answers</span>
              <span>2 views</span>
              <span>asked 7 secs ago</span>
            </div>
          </div>
          <div className={cx("title")}>
            <Link to={"/question"} className={cx("link")}>
              Use Mock in Jest test for rendering element in screen and find
              them with "findAllBy" method
            </Link>
          </div>
          <div className={cx("tags")}>
            <Button text small className={cx("tag")}>
              #flutter
            </Button>
            <Button text small className={cx("tag")}>
              #react
            </Button>
            <Button text small className={cx("tag")}>
              #jsx
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
