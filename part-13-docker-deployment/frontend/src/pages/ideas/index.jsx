import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CourseMakerClient from "../../client";
import config from "../../config";
import logo from "../../logo.svg";
import RecipeTable from "../../components/RecipeTable";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

import "./index.scss";
import IdeaTable from "../../components/IdeaTable";

const client = new CourseMakerClient(config);

const Ideas = () => {
	const [loading, setLoading] = useState(true);
	const [ideas, setIdeas] = useState([]);
	const [searchError, setSearchError] = useState(false);
	const [activeTab, setActiveTab] = useState("recipes");

	const keyword = useRef();

	useEffect(() => {
		// SET THE INITIAL KEYWORD
		keyword.current = "";

		// FETCH THE RECIPIES
		fetchIdeas();
	}, []);

	const fetchIdeas = (search) => {
		if (keyword.current?.length <= 0 && search)
			return alert("Please Enter Search Text");

		// SET THE LOADER TO TURE
		setLoading(true);

		// GET THE RECIPIES FROM THE API
		client.getIdeas().then((data) => {
			setLoading(false);
			// SET THE IDEAS DATA
			setIdeas(data);
		});
	};

	if (loading) return <Loader />;

	return (
		<>
			<section className="bg-black ">
				<DashboardHeader />

				<div className="container px-5 py-12 mx-auto lg:px-20">
					<div className="flex flex-col flex-wrap pb-6 mb-12 ">
						<h1 className="mb-6 text-3xl font-medium text-white">
							Ideas - Better than all the REST
						</h1>
						{/* <!-- This is Search component --> */}
						{/* <div className="container flex justify-center items-center mb-6">
                    <div className="relative w-full max-w-xs m-auto"> 
                        <input 
                          type="text" 
                          onChange={(e) => keyword.current = e.target.value}
                          className={`text-teal-500 z-20 hover:text-teal-700 h-14 w-full max-w-xs m-auto pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none`} placeholder="Search anything..."/>
                        <div className="absolute top-2 right-2">
                          <button onClick={() => fetchIdeas(true)} className="h-10 w-20 text-white rounded bg-teal-500 hover:bg-teal-600">Search</button>
                        </div>
                    </div>
                </div> */}
						{/* <p className="text-base leading-relaxed">
              Sample recipes...</p> */}
						<div className="flex flex-row justify-center w-full">
							<div className="w-full md:w-2/3 mb-5">
								<div className="sm:hidden">
									<label for="tabs" className="sr-only text-white">
										Select your country
									</label>
									<select
										id="tabs"
                    onChange={(e) => setActiveTab(e.target.value)}
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									>
										<option value="recipes">
											Recipes
										</option>
										<option value={"easyrecipes"}>
											Easy Recipes
										</option>
										<option value={"TopSecretRecipes"}>
											Secret Recipes
										</option>
									</select>
								</div>
								<ul className="flex hidden rounded-lg divide-x divide-gray-200 shadow sm:flex dark:divide-gray-700">
									<li className="w-full">
										<Link
											to="#"
											onClick={() => setActiveTab("recipes")}
											className={`inline-block relative py-4 px-4 w-full text-sm font-medium text-center ${
												activeTab === "recipes"
													? "text-white bg-teal-500"
													: "text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 "
											} rounded-l-lg dark:bg-gray-700 dark:text-white`}
										>
											Recipes
										</Link>
									</li>
									<li className="w-full">
										<Link
											to="#"
											onClick={() => setActiveTab("easyrecipes")}
											aria-current="page"
											className={`inline-block relative py-4 px-4 w-full text-sm font-medium text-center ${
												activeTab === "easyrecipes"
													? "text-white bg-teal-500"
													: "text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 "
											} dark:text-gray-400 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white`}
										>
											Easy Recipes
										</Link>
									</li>
									<li className="w-full">
										<Link
											to="#"
											onClick={() => setActiveTab("TopSecretRecipes")}
											className={`inline-block relative py-4 px-4 w-full text-sm font-medium text-center ${
												activeTab === "TopSecretRecipes"
													? "text-white bg-teal-500"
													: "text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 "
											}  rounded-r-lg  dark:text-gray-400 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white`}
										>
											Secret Recipes
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="mainViewport">
							{ideas[activeTab]?.length > 0 && (
								<IdeaTable ideas={ideas[activeTab]} />
							)}
						</div>
					</div>
				</div>
				<Footer />
			</section>
		</>
	);
};

export default Ideas;
