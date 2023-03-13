import { useDispatch } from "react-redux";
import { login, bookmark } from "~/pages/Auth/authSlice";

const LoadUserState = (state) => {
  const dispatch = useDispatch();

  if (Object.keys(state.currentUser).length === 0) {
    let userSession = localStorage.getItem("itsSession");
    if (userSession === null) {
      return state.currentUser;
    }
    dispatch(login(JSON.parse(userSession)));
  }
  if (Object.keys(state.bookmarks).length === 0) {
    let userBookmarks = sessionStorage.getItem("bookmark");
    if (userBookmarks === null || userBookmarks === {}) {
      return state.bookmarks;
    }
    dispatch(bookmark(JSON.parse(userBookmarks)));
  }
};

export { LoadUserState };
