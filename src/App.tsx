import { BrowserRouter, Route, Routes } from "react-router";
import GreenAreas from "./pages/green-areas";

function App() {
  return (
    <BrowserRouter basename={"/cloudmatize-prototypes/"}>
      <Routes>
        <Route path="/" element={<GreenAreas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
