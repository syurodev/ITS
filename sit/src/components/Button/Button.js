import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import style from "./Button.module.scss";
import { memo } from "react";

const cx = classNames.bind(style);

function Button({
  to = false,
  href = false,
  primary,
  outline = false,
  text = false,
  onlyicon = false,
  small = false,
  fwidth = false,
  large = false,
  micon = false,
  nbg = false,
  licon = false,
  disable = false,
  rounded = false,
  start = false,
  end = false,
  danger = false,
  successfully = false,
  outlineSuccessfully = false,
  column = false,
  smallLeft = false,
  ntd = false,
  nmw = false,
  lightgray = false,
  className,
  leftIcon,
  rightIcon,
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
    text,
    onlyicon,
    ntd,
    nmw,
    rounded,
    start,
    nbg,
    end,
    column,
    small,
    fwidth,
    smallLeft,
    large,
    licon,
    micon,
    className,
    disable,
    danger,
    lightgray,
    successfully,
    outlineSuccessfully,
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
      <samp className={cx("title", className)}>{children}</samp>
      {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
    </Component>
  );
}

export default memo(Button);
