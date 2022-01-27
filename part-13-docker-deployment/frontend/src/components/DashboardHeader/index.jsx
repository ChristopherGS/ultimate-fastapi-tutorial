import React, {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './index.scss';
import FastAPIClient from '../../client';
import config from '../../config';
import jwtDecode from "jwt-decode";
import * as moment from "moment";

const client = new FastAPIClient(config);

function DashboardHeader() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // STATE WHICH WE WILL USE TO TOGGLE THE MENU ON HAMBURGER BUTTON PRESS
  const [toggleMenu, setToggleMenu] = useState(false);

  useEffect(() => {
    const tokenString = localStorage.getItem("token")
	if (tokenString) {
        const token = JSON.parse(tokenString)
        const decodedAccessToken = jwtDecode(token.access_token)
        const isAccessTokenValid =
            moment.unix(decodedAccessToken.exp).toDate() > new Date()
        setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    client.logout();
    setIsLoggedIn(false)
    navigate('/')
  }

  const handleLogin = () => {
    navigate("/login");
  }

  let displayButton;
  const buttonStyle = "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"

  if (isLoggedIn) {
      displayButton = <button className={buttonStyle} onClick={() => handleLogout()}>Logout</button>;
    } else {
      displayButton = <button className={buttonStyle} onClick={() => handleLogin()}>Login</button>;
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
            className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
            onClick={() => setToggleMenu(!toggleMenu)}>
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
            </svg>
        </button>
        </div>
        <div className={`animate-fade-in-down w-full ${toggleMenu ? "block" : "hidden"} flex-grow lg:flex lg:items-center lg:w-auto`}>
            <div className="text-sm lg:flex-grow">
                <Link to="/docs"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    API Docs
                </Link>
                <Link to="/ideas"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    Ideas
                </Link>
                <Link to="/my-recipes"
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mx-4">
                    My Recipes
                </Link>
                {!isLoggedIn && <Link
                    className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
                    to={`/sign-up`}>
                    Create Account
                </Link>}
            </div>
            <div>
              {displayButton}
            </div>
        </div>
      </nav>
  );
}

export default DashboardHeader;
