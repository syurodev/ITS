import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

import style from "./Works.module.scss";
import routesConfig from "~/config/router";
import Button from "~/components/Button";
import Image from "~/components/Image";
import CustomTagsInput from "~/components/TagsInput";
import Pagination from "~/components/Pagination";
import * as workServices from "~/services/workServices";
import Modal from "~/components/Modal";
import WorkDetail from "~/components/WorkDetail";

function Works() {
  const cx = classNames.bind(style);
  const navigate = useNavigate();

  const { tag = null } = useParams();
  const { user = null } = useParams();
  const [tags, setTags] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [page, setPage] = useState(1);
  const [works, setWorks] = useState([]);
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [workData, setWorkData] = useState([]);

  useEffect(() => {
    document.title = "ITSocial :: Works";
  }, []);

  const currentUser = useSelector((state) => {
    return state.user.userId;
  });

  useEffect(() => {
    if (Object.keys(currentUser).length === 0) {
      const userSession = localStorage.getItem("itsSession");
      if (!userSession) {
        navigate(routesConfig.login);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filter, setFilter] = useState({
    limit: 10,
    sort: "createdAt",
    page: 1,
    user: user && user,
    tags: [],
  });

  useEffect(() => {
    const newTagsPargams = [];
    if (tags.length > 0) {
      tags.forEach((tag) => {
        newTagsPargams.push(tag.text);
      });
    }
    if (tag) {
      newTagsPargams.push(tag);
    }
    setFilter((prevFilter) => ({
      ...prevFilter,
      tags: newTagsPargams,
    }));
  }, [tag, tags]);

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      user: user && user,
    }));
  }, [user]);

  // FetchAPI
  const getWorks = async () => {
    const result = await workServices.getWorks(
      filter.limit,
      filter.sort,
      filter.tags,
      filter.user,
      filter.page
    );
    setWorks(result.data);
    setPage(result.page);
    const pageArray = Array.from(
      { length: result.totalPages },
      (_, i) => i + 1
    );
    setTotalPages(pageArray);
  };

  useEffect(() => {
    getWorks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handelOpenWorkModal = (data) => {
    setWorkModalOpen(true);
    setWorkData(data);
  };

  return (
    <motion.div
      className={cx("wrapper")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cx("top-nav")}>
        <h1>Works</h1>
        <div className={cx("sort")}>
          <div className={cx("tags-sort")}>
            <CustomTagsInput tags={tags} setTags={setTags} />
          </div>
        </div>
      </div>

      {works?.length === 0 ? (
        <div className={cx("no-work")}>
          <span>Không có công việc nào</span>
        </div>
      ) : (
        <div className={cx("container")}>
          {works.map((work) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                key={work._id}
                className={cx("item")}
              >
                <div className={cx("avatar")}>
                  <Image src={work.user.avatar} />
                </div>

                <div className={cx("details")}>
                  <span
                    className={cx("title")}
                    onClick={() => handelOpenWorkModal(work)}
                  >
                    {work.title}
                  </span>
                  <div className={cx("detail")}>
                    <span className={cx("company")}>{work.user.company}</span>
                  </div>
                  <div className={cx("more")}>
                    <div className={cx("position")}>
                      <FontAwesomeIcon icon={faCrosshairs} />
                      <span className={cx("money")}>{work.position}</span>
                    </div>
                    <div className={cx("salary")}>
                      <FontAwesomeIcon icon={faMoneyBill} />
                      <span className={cx("money")}>
                        {`${work?.salary} ${work?.currency}`}
                      </span>
                    </div>
                  </div>

                  <div className={cx("tags")}>
                    {JSON.parse(work.tags).map((tag, index) => (
                      <Button
                        key={index}
                        text
                        small
                        className={cx("tag")}
                        to={`/works/${tag}`}
                      >
                        # {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {totalPages && (
        <Pagination
          totalPages={totalPages}
          setFilter={setFilter}
          currentPage={page}
        />
      )}
      {workModalOpen && (
        <Modal closeModal={setWorkModalOpen}>
          <WorkDetail
            data={workData}
            auth={currentUser._id}
            closeModal={setWorkModalOpen}
            getWorks={getWorks}
          />
        </Modal>
      )}
    </motion.div>
  );
}

export default Works;
