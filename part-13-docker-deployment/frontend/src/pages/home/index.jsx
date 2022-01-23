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

  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    fetchExampleRecipes()
  }, [])

  const fetchExampleRecipes = () => {
    client.getSampleRecipes('chicken').then((data) => {
      setRecipes(data?.results)
    })
  }

  return (
      <RecipeTable
          recipes={recipes}
      />
  )
}


const Home = () => {

  return (
    <>
      <section className="bg-black ">
        <DashboardHeader />
        <div className="container px-5 py-12 mx-auto lg:px-20">
          {/*TODO - move to component*/}
          <div className="flex flex-col flex-wrap pb-6 mb-12 text-white ">
            <h1 className="mb-12 text-3xl font-medium text-white">
              Recipes - Better than all the REST
            </h1>
            <p className="text-base leading-relaxed">
              Sample recipes...</p>

            <div className="mainViewport">
              <MainView />
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  )
}

export default Home;