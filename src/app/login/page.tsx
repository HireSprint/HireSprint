"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAuth } from "../components/provider/authprovider"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const { login, user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

  const onSubmit = async (data: any) => {
    await login(data.email, data.password)
    reset()
  }

  const onSubmitRegister: SubmitHandler<any> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
          toast.error("Las contraseñas no coinciden");
          return;
      }

      const response = await fetch(`https://hiresprintcanvas.dreamhosters.com/createClient`, {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
          },
          credentials: 'omit', // Cambiado de 'include' a 'omit'
          body: JSON.stringify({
              email: data.email,
              password: data.password,
              client_name: data.client_name,
              client_phone: data.phone,
              client_address: data.address
          })
      });

        console.log('Respuesta del servidor:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            if (response.status === 403) {
                toast.error("No tienes permisos para realizar esta acción");
                return;
            }
            
            throw new Error(errorText || `Error del servidor: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success("¡Usuario creado exitosamente!");
        setIsRegistering(false);
        reset();
        
    } catch (error: any) {
        console.error('Error al crear usuario:', error);
        toast.error(error.message || "Error al crear usuario");
    }
};

console.log(user?.id, "user");
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <div className='flex items-center justify-center w-96 h-16 bg-[#393939] rounded-tr-3xl rounded-tl-3xl shadow-lg'>
        <Image src="/HPlogo.png" alt="Retail Fluent" width={70} height={70} />
        <Image src="/nameLogo.png" alt="Retail Fluent" width={120} height={100} className='pt-3' />
      </div>
      <form
        onSubmit={handleSubmit(isRegistering ? onSubmitRegister : onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl mb-6 text-center text-black">
          {isRegistering ? "Create Account" : "Login"}
        </h2>

        {isRegistering && (
          <>
            <div className="mb-4">
              <input
                placeholder="Full Name"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                {...register("client_name", { required: "The name is required" })}
              />
              {errors.client_name &&
                <span className="text-red-500 text-sm">{errors.client_name.message as string}</span>
              }
            </div>

            <div className="mb-4">
              <input
                placeholder="Phone"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                {...register("phone", { required: "The phone is required" })}
              />
              {errors.phone &&
                <span className="text-red-500 text-sm">{errors.phone.message as string}</span>
              }
            </div>

            <div className="mb-4">
              <input
                placeholder="Address"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                {...register("address", { required: "The address is required" })}
              />
              {errors.address &&
                <span className="text-red-500 text-sm">{errors.address.message as string}</span>
              }
            </div>
          </>
        )}

        <div className="mb-4">
          <input
            placeholder="Email"
            id="email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            {...register("email", {
              required: "The email is required",
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

        <div className="mb-4">
          <input
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            {...register("password", {
              required: "The password is required",
              minLength: { value: 6, message: "The password must be at least 6 characters" }
            })}
          />
          {errors.password &&
            <span className="text-red-500 text-sm">{errors.password.message as string}</span>
          }
        </div>

        {isRegistering && (
          <div className="mb-6">
            <input
              placeholder="Confirm Password"
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return "The passwords do not match";
                  }
                }
              })}
            />
            {errors.confirmPassword &&
              <span className="text-red-500 text-sm">{errors.confirmPassword.message as string}</span>
            }
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#7cc304] text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          {isRegistering ? "Register" : "Login"}
        </button>

        <p
          className="text-center mt-4 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "¿Already have an account? Login" : "¿No have an account? Register"}
        </p>
      </form>
    </div>
  )
}

export default Login;
