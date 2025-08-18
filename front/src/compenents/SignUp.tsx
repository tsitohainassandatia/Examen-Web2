import { Link } from "react-router-dom"

export default function SignUp() {
    return(
        <>
            <div className="bg-green-50 flex justify-center items-center h-screen">
                <div className="flex-row space-y-5 place-items-center bg-white text-center  shadow-[0_0_10px] shadow-gray-400 rounded-4xl py-5 px-3.5 w-min">
                    <h1 className="font-bold text-2xl">Expense tracker</h1>
                    <hr className="w-48 border-b-2 border-gray-400"/>
                    <br />
                    <div className="w-min rounded-lg border-2 border-gray-400">
                        <input type="email" 
                        placeholder="enter your email" 
                        className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-green-50"/>
                    </div>
                    <br />
                    <div className="w-min rounded-lg border-2 border-gray-400 ">
                        <input type="password"
                        placeholder="create your password"
                        className="py-1 px-1.5 rounded-lg w-68 focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-300 bg-green-50" />
                    </div>
                    <button type="submit" className="bg-emerald-700 font-bold text-white text-center py-1 px-2.5 rounded-lg hover:scale-110 duration-200">Sign up</button>
                    <p>Do you already have an account? <Link to='/login' className="text-emerald-700 underline">Log in</Link></p>
                </div>
            </div> 
        </>
    )
}