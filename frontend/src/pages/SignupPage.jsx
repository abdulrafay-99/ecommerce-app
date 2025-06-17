import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, User2 } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore.js";
// import { useUserStore } from "../stores/useUserStore";

export const Label=({label,id})=>{
		return <label className="block text-sm font-medium text-gray-300;" htmlFor={id}>
			{label}
		</label>
	}

export const Input=({icon:InputIcon,...inputProps})=>{
		return <div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<InputIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									{...inputProps}
									className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
									 focus:border-emerald-500 sm:text-sm'
								/>
							</div>
		
	}
const SignUpPage = () => {
	const {setUser}=useUserStore();
	const [loading, setLoading] = useState(false)

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const {name,email,password,confirmPassword}= formData;
		if(password!=confirmPassword){
			toast.error("Passwords do not match")
		}
	try {
		    console.log(import.meta)

		const res = await axiosInstance.post("/auth/signup",{name,email,password})
		setUser(res.data)
		setLoading(false);
	} catch (error) {
		setLoading(false);
		toast.error(error.response.data.message || "An error occurred")
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
				<div>
					<form autoComplete='on' onSubmit={handleSubmit} className='space-y-6 bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
						<fieldset>
							<Label label="Full Name" id="name"/>
							<Input icon={User} id='name'
									name="name"
									type='text'
									autoComplete='name'
									required
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									placeholder='John Doe' />
							
						</fieldset >

						<fieldset>
							<Label label="Email address" id="email"/>
							<Input icon={Mail}
							id='email'
									type='email'
									autoComplete='email'
									required
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
									required
									autoComplete='new-password'
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									placeholder='••••••••'
									/>
						</fieldset>

						<fieldset>
							<Label label="Confirm Password" id="confirmPassword"/>
							<Input icon={Lock}
							id='confirmPassword'
									type='password'
									autoComplete='new-password'
									required
									value={formData.confirmPassword}
									onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
									className=' block w-full px-3 py-2 pl-10 bg-gray-700 border
									 border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'/>
						</fieldset>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4  
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
									<UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
									Sign up
								</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-gray-400'>
						Already have an account?{" "}
						<Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
							Login here <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};
export default SignUpPage;