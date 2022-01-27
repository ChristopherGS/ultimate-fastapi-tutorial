import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import CourseMakerClient from '../../client';
import config from '../../config';
import logo from "../../logo.svg";
import RecipeTable from "../../components/RecipeTable"
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import Loader from '../../components/Loader';

const client = new CourseMakerClient(config);


const Home = () => {

  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState([])
  const [searchError, setSearchError] = useState(false)
  const keyword = useRef()

  useEffect(() => {
    // SET THE INITIAL KEYWORD
    keyword.current = ""

    // FETCH THE RECIPIES
    fetchRecipes()
  }, [])


  const fetchRecipes = (search) => {

    if(keyword.current?.length <= 0 && search)
      return alert("Please Enter Search Text")

    // SET THE LOADER TO TURE
    setLoading(true)

    // GET THE RECIPIES FROM THE API
    client.getRecipes(keyword.current || "chicken").then((data) => {
      setLoading(false)

      // SET THE RECIPIES DATA
      setRecipes(data?.results)
    });
  }


  if(loading)
    return <Loader />

  return (
    <>
      <section className="bg-black ">
        <DashboardHeader />

        <div className="container px-5 py-12 mx-auto lg:px-20">
          
          <div className="flex flex-col flex-wrap pb-6 mb-12 text-white ">
            <h1 className="mb-6 text-3xl font-medium text-white">
              Recipes - Better than all the REST
            </h1>
            {/* <!-- This is an example component --> */}
                <div className="container flex justify-center items-center mb-6">
                    <div className="relative w-full max-w-xs m-auto"> 
                        <input 
                          type="text" 
                          onChange={(e) => keyword.current = e.target.value}
                          className={`text-teal-500 z-20 hover:text-teal-700 h-14 w-full max-w-xs m-auto pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none`} placeholder="Search anything..."/>
                        <div className="absolute top-2 right-2">
                          <button onClick={() => fetchRecipes(true)} className="h-10 w-20 text-white rounded bg-teal-500 hover:bg-teal-600">Search</button>
                        </div>
                    </div>
                </div>
            {/* <p className="text-base leading-relaxed">
              Sample recipes...</p> */}
            <div className="mainViewport">
            <RecipeTable
                recipes={recipes}
            />
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  )
}

export default Home;