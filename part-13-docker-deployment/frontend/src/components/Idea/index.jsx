import { useState } from "react";

const Idea = ({ idea}) => {

    const init = idea.indexOf(":")
    const fin = idea.lastIndexOf("(")
    const fen = idea.lastIndexOf(")")


    const url = idea.substr(fin+1,fen-fin-1)
    const desc = idea.substr(init+1,fin-init-1)

	return (
		idea && (
			<>
				<div
					className="flex flex-wrap items-center justify-between w-full transition duration-500 ease-in-out transform bg-black border-2 border-gray-600 rounded-lg hover:border-white mb-3"
				>
					<div className="w-full xl:text-left md:w-2/5 ">
						<div className="relative flex flex-col h-full p-8 ">
							<h2 className="font-semibold tracking-widest text-white uppercase title-font text-center ">
								{desc}
							</h2>
						</div>
					</div>
					<div className="w-full xl:w-1/4 md:w-1/2 lg:ml-auto">
						<div className="relative flex flex-col h-full p-8">
							<h1 className="flex items-end mx-auto text-3xl font-black leading-none text-white ">
								<span>View Idea </span>
							</h1>
							<div className="flex flex-col md:flex-row">
								<a
									href={url}
									className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 w-full bg-teal-600 cursor-pointer hover:bg-teal-700 text-white font-bold px-4 py-2 mx-auto mt-3 rounded"
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

export default Idea;
