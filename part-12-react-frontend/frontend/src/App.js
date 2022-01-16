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
            <Route path="/" component={Home} />
            <Route exact path="/my-recipes" component={HomeRedirector} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/sign-up" component={SignUp} />
        </Routes>
        <div id="modal-root" />
    </BrowserRouter>
    </div>
  );
}

export default App;
