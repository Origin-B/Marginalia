import { useEffect, useState } from "react";

import Overlay from "../shared/Overlay";
import Button from "../shared/Button";
import LoginBtn from "../shared/LoginBtn";
import { NavLink } from "react-router-dom";

import { navList } from "../../data-types/data";

import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from "../icons/Icons";

export default function Navbar() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState("light");

  useEffect(() => {
    document.documentElement.classList = "";
    document.documentElement.classList.add(
      mode === "light" ? "light-classic" : "dark-midnight",
    );
  }, [mode]);

  return (
    <>
      <Overlay active={active} setActive={setActive} />

      <Button
        className="p-xs stroke-muted hover:stroke-foreground btn-rounded md:hidden"
        onClick={() => setActive(true)}
        ariaLabel="click to open navbar"
      >
        <MenuIcon />
      </Button>

      <div
        className={`${active ? "translate-x-0" : "translate-x-full"} bg-surface p-xs shadow-card gap-sm fixed top-0 right-0 flex h-screen w-3/4 max-w-100 flex-col transition-transform duration-300 sm:w-1/2 md:static md:h-fit md:w-fit md:translate-0 md:flex-row md:items-center md:bg-transparent md:p-0 md:shadow-none`}
      >
        <div className="flex items-center justify-between md:hidden">
          <h3>navbar</h3>

          <Button
            className="p-xs stroke-muted hover:stroke-foreground btn-rounded"
            onClick={() => setActive(false)}
            ariaLabel="click to open navbar"
          >
            <CloseIcon />
          </Button>
        </div>

        <nav className="gap-xs flex flex-col md:flex-row">
          {navList.map((item) => (
            <NavLink
              to={item.to}
              key={item.id}
              aria-label={`click to go to ${item.title} page`}
              className={({ isActive }) =>
                isActive ? "text-primary interactive-link" : "interactive-link"
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="gap-sm flex flex-col *:justify-center md:flex-row">
          <LoginBtn />
          <Button
            className="stroke-muted hover:stroke-foreground hover:text-foreground btn-outline btn-icon btn"
            ariaLabel={`click to activate ${mode === "light" ? "dark" : "light"} mode`}
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
          >
            {mode === "light" ? <SunIcon /> : <MoonIcon />}
            <span className="md:hidden">{mode} Mode</span>
          </Button>
        </div>
      </div>
    </>
  );
}
