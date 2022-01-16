import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import CourseMakerClient from '../../client';
import config from '../../config';
import logo from "../../logo.svg";
import RecipeTable from "../../components/RecipeTable"

const client = new CourseMakerClient(config);


const MainView = () => {

  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    setRecipes(fetchRecipes())
  }, [])

  const fetchRecipes = () => {
    return [
        {
          "label": "Chicken Vesuvio",
          "source": "Serious Eats",
          "url": "http://www.seriouseats.com/recipes/2011/12/chicken-vesuvio-recipe.html",
          "id": 1,
          "submitter_id": 1
        }
    ]
  }

  return (
      <RecipeTable
          recipes={recipes}
      />
  )
}


const Home = () => {

  const [loggedIn, setLoggedIn] = useState(false);

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

  return (
    <>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1> Recipe App - Better Than All The REST </h1>
        </header>
        <div className="mainViewport">
          <MainView
            loginHandler={handleLogin}
            registerHandler={handleRegister}
            logoutHandler={handleLogout}
            loggedIn={loggedIn}
          />
        </div>
      </div>
    </>
  )
}

export default Home;


export const HomeRedirector = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard')
    } else {
      navigate('/login');
    }
  }, [navigate]);
  return null;
}