import TippyHeadless from "@tippyjs/react/headless";
import classNames from "classnames/bind";
import { useState, useEffect } from "react";

import { Wrapper as PopperWrapper } from "~/components/Popper";
import SearchQuestionItem from "~/components/SearchQuestionItem";
import style from "./Search.module.scss";

const cx = classNames.bind(style);

function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSearchResult([]);
    }, 0);
  }, []);

  const handleHideResult = () => {
    setShowResult(false);
  };

  return (
    <TippyHeadless
      interactive
      visible={showResult && searchResult.length > 0}
      render={(attrs) => (
        <div className={cx("search-result")} tabIndex="-1" {...attrs}>
          <PopperWrapper>
            <SearchQuestionItem />
            <SearchQuestionItem />
            <SearchQuestionItem />
            <SearchQuestionItem />
          </PopperWrapper>
        </div>
      )}
      onClickOutside={handleHideResult}
    >
      <div className={cx("search-box")}>
        <input
          className={cx("search-input")}
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowResult(true)}
        />
        <button className={cx("search-button")}>
          <lord-icon
            src="https://cdn.lordicon.com/xfftupfv.json"
            trigger="click"
            colors="primary:#030e12"
            style={{ width: "30px", height: "30px" }}
          ></lord-icon>
        </button>
      </div>
    </TippyHeadless>
  );
}

export default Search;
