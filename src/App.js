import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import "reactjs-popup/dist/index.css";
import Header from "./components/Header";
import Movies from "./components/Movies";
import Starred from "./components/Starred";
import WatchLater from "./components/WatchLater";
import TrailerModal from "./components/TrailerModal";
import "./app.scss";

const App = () => {
  const movieId = useSelector((state) => state.trailer?.movieId);

  return (
    <div className="App">
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/starred" element={<Starred />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
      {movieId && <TrailerModal />}
    </div>
  );
};

export default App;
