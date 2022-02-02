import React from "react"
import {Link} from "react-router-dom"

export const NotLoggedIn = () => 

<div className="flex flex-col bg-black" id="notfound">
    <div className="notfound text-white">
        <div className="notfound-404">
            <h1 className="mt-4">Oops!</h1>
            <h2>Login To Access The Page</h2>
        </div>
        <Link to="/login" className="rounded" >Go TO LOGIN</Link>
    </div>
</div>