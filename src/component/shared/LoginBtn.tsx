import { Link } from "react-router-dom";

import { LogInIcon } from "../icons/Icons";

export default function LogInBtn() {
  return (
    <Link
      to={"/from"}
      className="btn-icon btn-primary stroke-on-primary btn min-w-25"
      aria-label="click to log in"
    >
      <span>Log in</span> <LogInIcon />
    </Link>
  );
}
