import React, { useEffect, useState } from "react";
import FastAPIClient from "../../client";
import config from "../../config";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import jwtDecode from "jwt-decode";
import * as moment from "moment";
import RecipeTable from "../../components/RecipeTable";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import { NotLoggedIn } from "./NotLoggedIn";
import Loader from "../../components/Loader";
import PopupModal from "../../components/Modal/PopupModal";

const client = new FastAPIClient(config);

const ProfileView = ({ recipes }) => {
	return (
		<>
			<RecipeTable
				recipes={recipes}
				
				showUpdate={true}
			/>
			
		</>
	);
};

const RecipeDashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [error, setError] = useState({ label: "", url: "", source: "" });
	const [recipeForm, setRecipeForm] = useState({
		label: "",
		url: "https://",
		source: "",
	});

	const [showForm, setShowForm] = useState(false);
	const [recipes, setRecipes] = useState([]);

	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(true);

	useEffect(() => {
		fetchUserRecipes();
	}, []);

	const fetchUserRecipes = () => {
		client.getUserRecipes().then((data) => {
			setRefreshing(false);
			setRecipes(data?.results);
		});
	};

   const urlPatternValidation = URL => {
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
          return regex.test(URL);
        };

	const onCreateRecipe = (e) => {
		e.preventDefault();
		setLoading(true);
		setError(false);

		if (recipeForm.label.length <= 0) {
			setLoading(false);
			return setError({ label: "Please Enter Recipe Label" });
		}
		if (recipeForm.url.length <= 0) {
			setLoading(false);
			return setError({ url: "Please Enter Recipe Url" });
		}
		if (!urlPatternValidation(recipeForm.url)) {
			setLoading(false);
			return setError({ url: "Please Enter Valid URL" });
		}
		if (recipeForm.source.length <= 0) {
			setLoading(false);
			return setError({ source: "Please Enter Recipe Source" });
		}

		client.fetchUser().then((user) => {
			client
				.createRecipe(
					recipeForm.label,
					recipeForm.url,
					recipeForm.source,
					user?.id
				)
				// eslint-disable-next-line no-unused-vars
				.then((data) => {  // eslint:ignore
					fetchUserRecipes();
					setLoading(false);
					setShowForm(false);
				});
		});
	};

	useEffect(() => {
		const tokenString = localStorage.getItem("token");
		if (tokenString) {
			const token = JSON.parse(tokenString);
			const decodedAccessToken = jwtDecode(token.access_token);
			if (moment.unix(decodedAccessToken.exp).toDate() > new Date()) {
				setIsLoggedIn(true);
			}
		}
	}, []);

	if (refreshing) return !isLoggedIn ? <NotLoggedIn /> : <Loader />;

	return (
		<>
			<section
				className="flex flex-col bg-black text-center"
				style={{ minHeight: "100vh" }}
			>
				<DashboardHeader />
				<div className="container px-5 pt-6 text-center mx-auto lg:px-20">
						{/*TODO - move to component*/}
					<h1 className="mb-12 text-3xl font-medium text-white">
						Recipes - Better than all the REST
					</h1>

					<button
						className="my-5 text-white bg-teal-500 p-3 rounded"
						onClick={() => {
							setShowForm(!showForm);
						}}
					>
						Create Recipe
					</button>

					<p className="text-base leading-relaxed text-white">Latest recipes</p>
					<div className="mainViewport text-white">
						{recipes.length && (
							<ProfileView
								recipes={recipes}
								fetchUserRecipes={fetchUserRecipes}
							/>
						)}
					</div>
				</div>

				<Footer />
			</section>
			{showForm && (
				<PopupModal
					modalTitle={"Create Recipe"}
					onCloseBtnPress={() => {
						setShowForm(false);
						setError({ fullName: "", email: "", password: "" });
					}}
				>
					<div className="mt-4 text-left">
						<form className="mt-5" onSubmit={(e) => onCreateRecipe(e)}>
							<FormInput
								type={"text"}
								name={"label"}
								label={"Label"}
								error={error.label}
								value={recipeForm.label}
								onChange={(e) =>
									setRecipeForm({ ...recipeForm, label: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"url"}
								label={"Url"}
								error={error.url}
								value={recipeForm.url}
								onChange={(e) =>
									setRecipeForm({ ...recipeForm, url: e.target.value })
								}
							/>
							<FormInput
								type={"text"}
								name={"source"}
								label={"Source"}
								error={error.source}
								value={recipeForm.source}
								onChange={(e) =>
									setRecipeForm({ ...recipeForm, source: e.target.value })
								}
							/>
							<Button
								loading={loading}
								error={error.source}
								title={"Create Recipe"}
							/>
						</form>
					</div>
				</PopupModal>
			)}
		</>
	);
};

export default RecipeDashboard;
