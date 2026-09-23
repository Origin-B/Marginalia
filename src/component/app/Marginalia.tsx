import { Route, Routes } from "react-router-dom";

// component
import Header from "../header/Header";
import Home from "../../pages/Home";
import MainLibrary from "../../pages/MainLibrary";

export default function Marginalia() {
  return (
    <div className="*:p-base gap-base flex min-h-screen flex-col">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<MainLibrary />} />
      </Routes>
    </div>
  );
}
