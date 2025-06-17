import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
// import { useUserStore } from "../stores/useUserStore";
import { Label,Input } from "./SignupPage";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
	const {setUser}=useUserStore();
	const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res= await axiosInstance.post("/auth/login",{email,password})
			setUser(res.data.user);
			setLoading(false)
		} catch (error) {
			setLoading(false)
			toast.error(error.response.data.message || "An error occurred");
		}
	};

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create your account</h2>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<form autoComplete='on' onSubmit={handleSubmit} className='space-y-6'>
      <fieldset>
                    <Label label="Email address" id="email"/>
                    <Input icon={Mail}
                    id='email'
					name='email'
                        type='email'
						autoComplete='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
                        rounded-md shadow-sm
                         placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
                         focus:border-emerald-500 sm:text-sm'
                        placeholder='you@example.com'/>
                    
                  </fieldset>
      
                  <fieldset>
                    <Label label="Password" id="password"/>
                    <Input icon={Lock}
                    id='password'
                        type='password'
						autoComplete= "password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='••••••••'
                        />
                  </fieldset>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-gray-400'>
						Not a member?{" "}
						<Link to='/signup' className='font-medium text-emerald-400 hover:text-emerald-300'>
							Sign up now <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default LoginPage;