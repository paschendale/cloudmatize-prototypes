import { BrowserRouter, Route, Routes } from "react-router";
import GreenAreas from "./pages/green-areas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/green-areas" element={<GreenAreas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
