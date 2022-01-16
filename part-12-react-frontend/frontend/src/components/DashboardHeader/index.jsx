import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import './index.scss';
import CourseMakerClient from '../../client';
import config from '../../config';

const client = new CourseMakerClient(config);

function DashboardHeader({loggedIn, setLoggedIn}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    client.logout();
    setLoggedIn(false)
  }

  const handleLogin = (username, password) => {
    client.login(username, password)
      .then( () => {
        setLoggedIn(true)
      })
      .catch( (err) => {
        console.log(err);
        alert("Login failed.")
      });
  }

  const handleRegister = (username, password, fullName) => {
    client.register(username, password, fullName)
      .then( () => {
        alert("Register done. Please login")
        window.location.reload();
      })
      .catch( (err) => {
        console.log(err);
        alert("Register failed.")
      });
  }

  let displayButton;
  if (loggedIn) {
      displayButton = <button onClick={() => handleLogout()}>Logout </button>;
    } else {
      displayButton = <button onClick={() => handleLogin()}>Login</button>;
    }

  return (
      <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
              <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54"
                   xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/>
              </svg>
              <span className="font-semibold text-xl tracking-tight">ChristopherGS Teaches FastAPI</span>
          </div>
          <div className="block lg:hidden">
              <button
                  className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                  <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <title>Menu</title>
                      <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                  </svg>
              </button>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
              <div className="text-sm lg:flex-grow">
                  <a href="http://localhost:8001"
                     className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                      API Docs
                  </a>
                  <a href="https://christophergs.com/python/2021/12/04/fastapi-ultimate-tutorial/"
                     className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                      Create Account
                  </a>
              </div>
              <div>
                  <a href="#"
                     className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">{displayButton}</a>
              </div>
          </div>
      </nav>
  );
}

export default DashboardHeader;
