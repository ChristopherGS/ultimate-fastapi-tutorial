import React from "react";

function PopupModal({ onCloseBtnPress, modalTitle, children }) {
	return (
		<div className="animate-fade-in-down  container flex justify-center mx-auto">
			<div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
				<div
					className="rounded max-w-sm p-6 bg-indigo-100 divide-y divide-teal-500"
					style={{ minWidth: 400 }}
				>
					<div className="flex items-center justify-between">
						<h3 className="text-2xl text-teal-500">{modalTitle}</h3>
						<div className="cursor-pointer">
							<svg
								onClick={onCloseBtnPress}
								xmlns="http://www.w3.org/2000/svg"
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="rgb(13 148 136)"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
}

export default PopupModal;
