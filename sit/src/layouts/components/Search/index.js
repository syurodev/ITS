import TippyHeadless from "@tippyjs/react/headless";
import classNames from "classnames/bind";
import { useState, useEffect } from "react";

import { Wrapper as PopperWrapper } from "~/components/Popper";
import SearchQuestionItem from "~/components/SearchQuestionItem";
import style from "./Search.module.scss";
import * as questionServices from "~/services/questionServices";
import { useDebounce } from "~/hooks";
import { Link } from "react-router-dom";
import Button from "~/components/Button";

const cx = classNames.bind(style);

function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(true);
  const [searching, setSearching] = useState(false);

  let debounced = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!searchValue.trim()) {
      return;
    }
    setSearching(true);
    const fetchApi = async () => {
      const result = await questionServices.search(debounced.trim());
      setSearchResult(result);
      setSearching(false);
    };
    fetchApi();
  }, [debounced]);

  const handleChange = (e) => {
    if (e.target.value.startsWith(" ")) {
      setSearchValue("");
    } else {
      setSearchValue(e.target.value);
    }
  };
  const handleHideResult = () => {
    setShowResult(false);
  };

  return (
    <TippyHeadless
      interactive
      appendTo={() => document.body}
      visible={!!searchValue && searchResult.length > 0 && showResult}
      render={(attrs) => (
        <div className={cx("search-result")} tabIndex="-1" {...attrs}>
          <PopperWrapper>
            {searchResult.map((result) => {
              return (
                <Link
                  key={result._id}
                  to={`/question/${result._id}`}
                  onClick={() => {
                    setSearchValue("");
                  }}
                >
                  <SearchQuestionItem data={result} />
                </Link>
              );
            })}
          </PopperWrapper>
        </div>
      )}
      onClickOutside={handleHideResult}
    >
      <div className={cx("search-box")}>
        <input
          spellCheck="false"
          value={searchValue}
          className={cx("search-input")}
          type="text"
          placeholder="Search..."
          onChange={handleChange}
          onFocus={() => setShowResult(true)}
        />
        {searching ? (
          <lord-icon
            src="https://cdn.lordicon.com/ymrqtsej.json"
            trigger="loop"
            delay="0"
            style={{ width: "250", height: "250" }}
          ></lord-icon>
        ) : (
          <></>
        )}

        <Button
          text
          small
          nmw
          onlyicon
          leftIcon={
            <lord-icon
              src="https://cdn.lordicon.com/xfftupfv.json"
              trigger="click"
              colors={searchValue ? "primary:#ed7966" : "primary:#030e12"}
              style={{ width: "30px", height: "30px" }}
            ></lord-icon>
          }
        />
      </div>
    </TippyHeadless>
  );
}

export default Search;
