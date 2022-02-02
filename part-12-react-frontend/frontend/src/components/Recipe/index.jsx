import React from "react";

const Recipe = ({ recipe,  showRecipeInfoModal }) => {
	return (
		recipe && (
			<>
				<div
					
					onClick={(e) => {showRecipeInfoModal() ; e.stopPropagation()}} 
					className="flex flex-wrap items-end justify-between w-full transition duration-500 ease-in-out transform bg-black border-2 border-gray-600 rounded-lg hover:border-white mb-3"
				>
					<div className="w-full xl:w-1/4 md:w-1/4">
						<div className="relative flex flex-col h-full p-8 ">
							<h2 className="mb-4 font-semibold tracking-widest text-white uppercase title-font">
								{recipe?.label}
							</h2>
							<h2 className="items-center mb-2 text-lg font-normal tracking-wide text-white">
								<span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-white rounded-full bg-blue-1300">
									<svg
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2.5"
										className="w-4 h-4"
										viewBox="0 0 24 24"
									>
										<path d="M20 6L9 17l-5-5"></path>
									</svg>
								</span>
								{recipe?.source}
							</h2>
						</div>
					</div>
					<div className="w-full xl:w-1/4 md:w-1/2 lg:ml-auto" style={{zindex: 10000}}>
						<div className="relative flex flex-col h-full p-8">
							<h1 className="flex items-end mx-auto text-3xl font-black leading-none text-white ">
								<span>View Recipe </span>
							</h1>
							<div className="flex flex-col md:flex-row">
								
								<a
									href={`${recipe?.url}`}
									onClick={(e) => e.stopPropagation()}
									className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  bg-teal-600 cursor-pointer hover:bg-teal-700 text-white font-bold px-4 py-2 mx-auto mt-3 rounded"
								>
									{/* className="w-full px-4 py-2 mx-auto mt-3 text-white transition duration-500 ease-in-out transform border border-gray-900 rounded-lg text-md hover:bg-gray-900 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 focus:border-gray-700 focus:bg-gray-800 "> */}
									Visit Site
								</a>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	);
};

export default Recipe;
