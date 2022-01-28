import React, {useEffect, useRef, useState} from 'react';
import FastAPIClient from '../../client';
import config from '../../config';
import RecipeTable from "../../components/RecipeTable"
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import Loader from '../../components/Loader';

const client = new FastAPIClient(config);



const Home = () => {

  const [loading, setLoading] = useState(true)
  const [recipes, setRecipes] = useState([])
  const keyword = useRef()

  useEffect(() => {
    keyword.current = ""
    fetchRecipes()
  }, [])

  const fetchRecipes = (search) => {

      if (keyword.current?.length <= 0 && search)
          return alert("Please Enter Search Text")

      setLoading(true)

      // Get the recipes from the API
      client.getRecipes(keyword.current || "chicken").then((data) => {
          setLoading(false)
      })
  }

  const fetchExampleRecipes = () => {
    client.getSampleRecipes('chicken').then((data) => {
        setLoading(false)

        if (loading)
            return <Loader/>
    })
  }

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