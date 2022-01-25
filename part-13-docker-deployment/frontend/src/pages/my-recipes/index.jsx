import React, {useEffect, useState} from 'react';
import FastAPIClient from '../../client';
import config from '../../config';
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import {Link, useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";
import * as moment from "moment";
import RecipeTable from "../../components/RecipeTable";
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';

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
  const [error, setError] = useState({ label: '', url: '', source: '' });
  const [recipeForm, setRecipeForm] = useState({ label: '', url: '', source: '' });
  const [showForm, setShowForm] = useState(false)
  const [recipes, setRecipes] = useState([])

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(true)

  useEffect(() => {
    fetchUserRecipes()
  }, [])

  const fetchUserRecipes = () => {
    client.getUserRecipes().then((data) => {
      setRefreshing(false)
      setRecipes(data?.results)
    })
  }

  const onCreateRecipe = (e) => {
    e.preventDefault();
    setLoading(true)
    setError(false);

    if(recipeForm.label.length <= 0)
    {
      setLoading(false)
      return setError({label: "Please Enter Recipe Label"}) 
    }
    if(recipeForm.url.length <= 0)
    {
      setLoading(false)
      return setError({url: "Please Enter Recipe Url"})
    }
    if(recipeForm.source.length <= 0)
    {
      setLoading(false)
      return setError({source: "Please Enter Recipe Source"})
    }

    console.log('====================================');
    console.log(recipeForm);
    console.log('====================================');

    client.fetchUser().then((user) => {
      client.createRecipe(recipeForm.label, recipeForm.url, recipeForm.source, user?.id).then(
          (data) => {
            fetchUserRecipes()
            setLoading(false)
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

  if(refreshing)
    return !isLoggedIn ?
      <Link
          className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
          to={`/login`}>
          Please Login
      </Link>
     : 
     <div className='flex justify-center items-center h-screen w-screen bg-white'>
        <img src='https://thumbs.gfycat.com/HugeDeliciousArchaeocete-max-1mb.gif' width={"auto"} height={"auto"} /> 
    </div> 

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
        <section className="flex flex-col bg-black text-center" style={{height: "100%"}}>
          <DashboardHeader/>
          <div className="container px-5 pt-6 text-center mx-auto lg:px-20">
            {/*TODO - move to component*/}
            <div className="flex flex-col flex-wrap pb-6 mb-12 text-white ">
              <h1 className="mb-12 text-3xl font-medium text-white">
                Recipes - Better than all the REST
              </h1>
              <p className="text-base leading-relaxed">Latest recipes</p>
              <div className="mainViewport">
                  {recipes.length &&
                      <ProfileView recipes={recipes}/>
                  }
              </div>
            </div>
              <button className="text-white bg-teal-500 p-3 rounded" onClick={() => {setShowForm(!showForm)}}>Create Recipe</button>
          </div>
            
           {showForm && <div className="animate-fade-in-down  container flex justify-center mx-auto ">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
                  <div className="rounded max-w-sm p-6 bg-indigo-100 divide-y divide-teal-500" style={{minWidth: 400}}>
                      <div className="flex items-center justify-between">
                          <h3 className="text-2xl">Create Recipe</h3>
                          <div className="cursor-pointer">
                            <svg  onClick={() => {setShowForm(false); setError({fullName:"",email:"", password:""})}} xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                stroke="rgb(13 148 136)">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                      </div>
                      <div className="mt-4 text-left">
                      <form  className='mt-5' onSubmit={(e) => onCreateRecipe(e)}>
                          <FormInput 
                            type={"text"}
                            name={"label"}
                            label={"Label"}
                            error={error.label}
                            value={recipeForm.label}
                            onChange={(e) => setRecipeForm({...recipeForm, label: e.target.value })}
                          />
                         <FormInput 
                            type={"text"}
                            name={"url"}
                            label={"Url"}
                            error={error.url}
                            value={recipeForm.url} 
                            onChange={(e) => setRecipeForm({...recipeForm, url: e.target.value })}                            
                         />
                          <FormInput 
                            type={"text"}
                            name={"source"}
                            label={"Source"}
                            error={error.source}
                            value={recipeForm.source} 
                            onChange={(e) => setRecipeForm({...recipeForm, source: e.target.value })}
                          />
                          <Button 
                            loading={loading}
                            error={error.source}
                            title={"Create Recipe"}
                          />   
                        </form>
                      </div>
                  </div>
              </div>
            </div>}
          <Footer/>
        </section>
      }
      </>
  )
}

export default RecipeDashboard