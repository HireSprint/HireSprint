"use client"
import Image from "next/image"
import React from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../components/provider/authprovider"

 const Login = () => {
    const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const onSubmit = async (data: any) => {
    await login(data.email, data.password)
    reset()
  }


  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 ">
            <div className='flex items-center justify-center w-96 h-16 bg-[#393939] rounded-tr-3xl rounded-tl-3xl'>
                    <Image src="/HPlogo.png" alt="Retail Fluent" width={70} height={70}/>
                    <Image src="/nameLogo.png" alt="Retail Fluent" width={120} height={100} className='pt-3'/>

            </div>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <div className="mb-4 ">
          <input
            placeholder="Email"
            id="email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            {...register("email", {
              required: "required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            })}
            type="email"
          />
          {errors.email && 
            <span role="alert" className="text-red-500 text-sm">
              {errors.email.message as string}
            </span>
          }
        </div>

        <div className="mb-6">
          <input
            placeholder="Password"
            id="password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            {...register("password", {
              required: "required",
              minLength: {
                value: 5,
                message: "min length is 5",
              },
            })}
            type="password"
          />
          {errors.password && 
            <span role="alert" className="text-red-500 text-sm">
              {errors.password.message as string}
            </span>
          }
        </div>

        <button 
          type="submit"
          className="w-full bg-[#7cc304] text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Sign In
        </button>
        <p className=" text-gray-500 text-sm text-cyan-500 hover:underline cursor-pointer pt-2">Forgot password?</p>
      </form>
    </div>
  )
}

export default Login;
