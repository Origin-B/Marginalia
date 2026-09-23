import { Logo } from "../icons/Icons";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="app-header flex items-center justify-between">
      <Logo />
      <Navbar />
    </header>
  );
}
