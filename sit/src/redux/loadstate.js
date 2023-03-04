import { login } from "~/pages/Auth/authSlice";
import { useDispatch } from "react-redux";

const LoadUserState = (state) => {
  const dispatch = useDispatch();
  if (Object.keys(state).length === 0) {
    let userSession = localStorage.getItem("itsSession");
    if (userSession === null) {
      return state;
    }
    dispatch(login(JSON.parse(userSession)));
  }
};

export { LoadUserState };
