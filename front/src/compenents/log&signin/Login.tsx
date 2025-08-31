import { Link } from "react-router-dom"


export function Login() {
    return (
    <>
        <div className="bg-gray-800 flex justify-center items-center h-screen">
            <div className="flex-row space-y-5 place-items-center bg-black text-center  shadow-[0_0_10px] shadow-black rounded-4xl py-5 px-3.5 w-min">
                <h1 className="font-bold text-green-600 text-2xl">Expense tracker</h1>
                <hr className="w-48 border-b-2 border-gray-400"/>
                <br />
                <div className="w-min rounded-lg border-2 border-gray-400">
                    <input type="email" 
                    placeholder="enter your name" 
                    className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-black text-green-500"/>
                </div>
                <br />
                <div className="text-left">
                    <div className="w-min rounded-lg border-2 border-gray-400 ">
                    <input type="password"
                    placeholder="enter your password"
                    className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-black text-green-500" />
                    </div>
                    <Link to='/forgotpassword' className="text-green-500 underline">forgot password?</Link>
                </div>
                <button type="submit" className="bg-green-800 font-bold text-white text-center py-1 px-2.5 rounded-lg hover:scale-110 duration-200">Log in</button>
                <p className="text-white">Log in or <Link to='/signup' className="text-green-500 underline">Sign up</Link></p>
            </div>    
        </div>    
    </>
    )
}