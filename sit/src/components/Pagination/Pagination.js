import classNames from "classnames/bind";
import { useState, useEffect, memo } from "react";

import style from "./Pagination.module.scss";

function Pagination({ totalPages = [], setFilter, currentPage }) {
  const [visiblePages, setVisiblePages] = useState([]);
  const currentPageNumber = parseInt(currentPage);
  const cx = classNames.bind(style);

  const handleChangePage = (page) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: page,
    }));
  };

  useEffect(() => {
    let startPage = 1;
    let endPage = totalPages.length;
    const pagesToShow = [];

    if (totalPages.length > 5) {
      if (currentPageNumber <= 3) {
        endPage = 5;
      } else if (currentPageNumber >= totalPages.length - 2) {
        startPage = totalPages.length - 4;
      } else {
        startPage = currentPageNumber - 2;
        endPage = currentPageNumber + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    if (startPage > 2) {
      pagesToShow.unshift("...");
      pagesToShow.unshift(1);
    } else if (startPage === 2) {
      pagesToShow.unshift(1);
    }

    if (endPage < totalPages.length - 1) {
      pagesToShow.push("...");
      pagesToShow.push(totalPages.length);
    } else if (endPage === totalPages.length - 1) {
      pagesToShow.push(totalPages.length);
    }

    setVisiblePages(pagesToShow);
  }, [totalPages, currentPageNumber]);

  return (
    <div className={cx("wrapper")}>
      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={index} className={cx("page-btn", "ellipsis")}>
              {page}
            </span>
          );
        }
        return (
          <span
            key={index}
            className={cx("page-btn", {
              active: page === currentPageNumber,
            })}
            onClick={() => {
              handleChangePage(page);
            }}
          >
            {page}
          </span>
        );
      })}
    </div>
  );
}

export default memo(Pagination);
