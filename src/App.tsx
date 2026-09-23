// component
import Marginalia from "./component/app/Marginalia";

// hooks
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Marginalia />
      </BrowserRouter>
    </>
  );
}

export default App;
