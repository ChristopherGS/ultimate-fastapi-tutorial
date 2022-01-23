const Recipe = ({ recipe }) => {
  return recipe && (
    <>
        <div
            className="flex flex-wrap items-end justify-start w-full transition duration-500 ease-in-out transform bg-black border-2 border-gray-600 rounded-lg hover:border-white ">
            <div className="w-full xl:w-1/4 md:w-1/4">
                <div className="relative flex flex-col h-full p-8 ">
                    <h2 className="mb-4 font-semibold tracking-widest text-white uppercase title-font">
                        {recipe?.label}
                    </h2>
                    <p className="flex items-center mb-2 text-lg font-normal tracking-wide text-white">
                                <span
                                    className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 text-white rounded-full bg-blue-1300">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round"
                                         strokeLinejoin="round" strokeWidth="2.5" className="w-4 h-4"
                                         viewBox="0 0 24 24">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </span>{recipe?.source}
                    </p>
                </div>
            </div>
            <div className="w-full xl:w-1/4 md:w-1/4 lg:ml-auto">
                <div className="relative flex flex-col h-full p-8">
                    <h1 className="flex items-end mx-auto text-3xl font-black leading-none text-white ">
                        <span>View Recipe </span>
                    </h1>
                    <button
                        className="w-full px-4 py-2 mx-auto mt-3 text-white transition duration-500 ease-in-out transform border border-gray-900 rounded-lg text-md hover:bg-gray-900 focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 focus:border-gray-700 focus:bg-gray-800 ">
                        <a href={`${recipe?.url}`}>Visit Site</a>
                    </button>
                </div>
            </div>
        </div>
    </>
  );
}

export default Recipe;