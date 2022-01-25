import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import CourseMakerClient from '../../client';
import config from '../../config';
import logo from "../../logo.svg";
import RecipeTable from "../../components/RecipeTable"
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

const client = new CourseMakerClient(config);


const MainView = () => {
 
}


const Home = () => {

  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    fetchExampleRecipes()
  }, [])

  const fetchExampleRecipes = () => {
    client.getSampleRecipes('chicken').then((data) => {
      setLoading(false)
      setRecipes(data?.results)
    })
  }

  if(loading)
    return <div className='flex justify-center items-center h-screen w-screen bg-white'>

         <img src='https://thumbs.gfycat.com/HugeDeliciousArchaeocete-max-1mb.gif' width={"auto"} height={"auto"} /> 
    </div>

  return (
    <>
      <section className="bg-black ">
        <DashboardHeader />

        
        <div className="container px-5 py-12 mx-auto lg:px-20">
          
          <div className="flex flex-col flex-wrap pb-6 mb-12 text-white ">
            <h1 className="mb-12 text-3xl font-medium text-white">
              Recipes - Better than all the REST
            </h1>
            <p className="text-base leading-relaxed">
              Sample recipes...</p>
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