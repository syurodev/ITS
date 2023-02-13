import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import style from "./Button.module.scss";

const cx = classNames.bind(style);

function Button({
  to = false,
  href = false,
  primary,
  outline = false,
  small = false,
  large = false,
  disable = false,
  rounded = false,
  children,
  onClick,
}) {
  let Component = "button";
  const props = {
    onClick,
  };
  const classes = cx("wrapper", {
    primary,
    outline,
    small,
    large,
    disable,
    rounded,
  });

  if (to) {
    props.to = to;
    Component = Link;
  } else if (href) {
    props.href = href;
    Component = "a";
  }

  if (disable) {
    delete props.onClick;
  }

  return (
    <Component className={classes} {...props}>
      <samp>{children}</samp>
    </Component>
  );
}

export default Button;
