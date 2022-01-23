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

const ProfileView = ({recipes}) => {
  return (
      <RecipeTable
          recipes={recipes}
      />
  )
}

const RecipeDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [recipeForm, setRecipeForm] = useState({ label: '', url: '', source: '' });
  const [showForm, setShowForm] = useState(false)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserRecipes()
  }, [loading])

  const fetchUserRecipes = () => {
    client.getUserRecipes().then((data) => {
      setRecipes(data?.results)
    })
  }

  const onCreateRecipe = (e) => {
    e.preventDefault();
    setError(false);
    client.fetchUser().then((user) => {
      client.createRecipe(recipeForm.label, recipeForm.url, recipeForm.source, user?.id).then(
          (data) => {
            setLoading(true)  // triggers useEffect to fetch latest
            setShowForm(false)
          })
    })
  }

  useEffect(() => {
    const tokenString = localStorage.getItem("token")
	if (tokenString) {
        const token = JSON.parse(tokenString)
        const decodedAccessToken = jwtDecode(token.access_token)
        if(moment.unix(decodedAccessToken.exp).toDate() > new Date()){
            setIsLoggedIn(true)
        }
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
                  {recipes.length &&
                      <ProfileView recipes={recipes}/>
                  }
              </div>
            </div>
              <button className="text-white" onClick={() => {setShowForm(!showForm)}}>Create Recipe</button>
          </div>

            {showForm && (
                <>
                <h3 className="text-2xl font-bold text-center">Add Recipe</h3>
                <form onSubmit={(e) => onCreateRecipe(e)}>
                <div className="mt-4">
                <div>
                <label className="block" htmlFor="email">Label</label>
                <input type="text" placeholder="Chicken soup" value={recipeForm.label} onChange={(e) => setRecipeForm({...recipeForm, label: e.target.value})}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                </input>
                </div>
                <div className="mt-4">
                <label className="block">URL</label>
                <input type="text" placeholder="https://greatfood.com" value={recipeForm.url} onChange={(e) => setRecipeForm({...recipeForm, url: e.target.value})}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                </input>
                </div>
                <div className="mt-4">
                <label className="block">Source</label>
                <input type="text" placeholder="Anthony Bourdain" value={recipeForm.source} onChange={(e) => setRecipeForm({...recipeForm, source: e.target.value})}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                </input>
                </div>
                <div className="flex items-baseline justify-between">
                <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Create</button>
                </div>
                </div>
                </form>
                </>
            )}
          <Footer/>
        </section>

      }
      </>
  )
}

export default RecipeDashboard