import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import style from "./Button.module.scss";

const cx = classNames.bind(style);

function Button({
  to = false,
  href = false,
  primary,
  outline = false,
  text = false,
  small = false,
  large = false,
  disable = false,
  rounded = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  ...passProps
}) {
  let Component = "button";
  const props = {
    ...passProps,
    onClick,
  };
  const classes = cx("wrapper", {
    primary,
    outline,
    small,
    large,
    disable,
    rounded,
    text,
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
      {leftIcon && <span className={cx("icon")}>{leftIcon}</span>}
      <samp className={cx("title")}>{children}</samp>
      {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
    </Component>
  );
}

export default Button;
