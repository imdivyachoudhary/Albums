import "./App.css";

// react toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components imports
import AlbumsList from "./components/AlbumsList/AlbumsList";

function App() {

  return (
    <>
      <ToastContainer />
      <h2 className="mainHeading">
        ALBUMS
      </h2>
      <div className="App">
        <AlbumsList />
      </div>
    </>
  );
}

export default App;
