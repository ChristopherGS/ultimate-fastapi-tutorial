import React, {useEffect, useState} from 'react';
import FastAPIClient from '../../client';
import config from '../../config';
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import {Link, useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import * as moment from "moment";
import RecipeTable from "../../components/RecipeTable";

const client = new FastAPIClient(config)

const ProfileView = () => {

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

const RecipeDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
      <>
      {!isLoggedIn &&
        <Link
            className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
            to={`/login`}>
            Please Login
        </Link>
      }
      {isLoggedIn &&
        <section className="bg-black ">
          <DashboardHeader/>
          <div className="container px-5 py-12 mx-auto lg:px-20">
            {/*TODO - move to component*/}
            <div className="flex flex-col flex-wrap pb-6 mb-12 text-white ">
              <h1 className="mb-12 text-3xl font-medium text-white">
                Recipes - Better than all the REST
              </h1>
              <p className="text-base leading-relaxed">
                Latest recipes...</p>

              <div className="mainViewport">
                <ProfileView/>
              </div>
            </div>
          </div>
          <Footer/>
        </section>

      }
      </>
  )
}

export default RecipeDashboard