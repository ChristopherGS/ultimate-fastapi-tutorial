import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import SignUp from "./pages/sign-up"
import {HomeRedirector} from "./pages/home"
import Home from "./pages/home"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/my-recipes" element={<HomeRedirector />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/sign-up" element={<SignUp />} />
        </Routes>
        <div id="modal-root" />
    </BrowserRouter>
    </div>
  );
}

export default App;
