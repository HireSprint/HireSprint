"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAuth } from "../components/provider/authprovider"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const loginSuccess = await login(data.email, data.password);
      if (!loginSuccess) {
        toast.error("Email o contraseña incorrectos");
        return;
      }
      reset();
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);
      toast.error(error.message || "Error al iniciar sesión");
    }
  }

  const onSubmitRegister: SubmitHandler<any> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
          toast.error("Passwords do not match");
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
              client_city: data.city,
              client_state: data.state,
              client_zip: data.zipcode,
              client_address: data.address,
              client_country: data.country
          })
      });


        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);

            if (response.status === 403) {
                toast.error("You do not have permission to perform this action");
                return;
            }

            throw new Error(errorText || `Error del servidor: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success("User created successfully!");
        setIsRegistering(false);
        reset();

    } catch (error: any) {
        console.error('Error al crear usuario:', error);
        toast.error(error.message || "Error creating user");
    }
};


  const handleResetPassword: SubmitHandler<any> = async (data) => {
    try {
      if (data.newPassword !== data.confirmNewPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const response = await fetch(`https://hiresprintcanvas.dreamhosters.com/updatePassword`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        credentials: 'omit',
        body: JSON.stringify({
          email: data.email,
          password: data.newPassword,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || "Error updating password");
      }

      const result = await response.json();
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Password updated successfully");
      setIsForgotPassword(false);
      reset();
    } catch (error: any) {
      console.error('Error al actualizar contraseña:', error);
      toast.error(error.message || "Error updating password");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 overflow-y-auto">
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
      
      {isForgotPassword ? (
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="bg-white p-8 rounded-lg shadow-lg w-96"
        >
          <h2 className="text-2xl mb-6 text-center text-black">
            Reset Password
          </h2>

          <div className="mb-4">
            <input
              placeholder="Email"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              {...register("email", {
                required: "El email es requerido",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Formato de email inválido",
                },
              })}
              type="email"
            />
          </div>

          <div className="mb-4">
            <input
              placeholder="Nueva Contraseña"
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              {...register("newPassword", {
                required: "La contraseña es requerida",
                minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
              })}
            />
          </div>

          <div className="mb-4">
            <input
              placeholder="Confirmar Nueva Contraseña"
              type="password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              {...register("confirmNewPassword", {
                required: "Por favor confirma la contraseña",
                validate: (val: string) => {
                  if (watch('newPassword') != val) {
                    return "Las contraseñas no coinciden";
                  }
                }
              })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#7cc304] text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Change Password
          </button>

          <p
            className="text-center mt-4 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => {
              setIsForgotPassword(false);
              reset();
            }}
          >
            Back to login
          </p>
        </form>
      ) : (
        <>
          <form
            onSubmit={handleSubmit(isRegistering ? onSubmitRegister : onSubmit)}
            className="bg-white p-8 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-2xl mb-6 text-center text-black">
              {isRegistering ? "Create Account" : "Login"}
            </h2>

            {isRegistering && (
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <input
                    placeholder="Full Name"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    {...register("client_name", { required: "The name is required" })}
                  />
                  {errors.client_name && (
                    <span className="text-red-500 text-sm">{errors.client_name.message as string}</span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    placeholder="Phone"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    {...register("phone", { required: "The phone is required" })}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm">{errors.phone.message as string}</span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    placeholder="Address"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    {...register("address", { required: "The address is required" })}
                  />
                  {errors.address && (
                    <span className="text-red-500 text-sm">{errors.address.message as string}</span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    placeholder="City"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    {...register("city", { required: "The city is required" })}
                  />
                  {errors.city && (
                    <span className="text-red-500 text-sm">{errors.city.message as string}</span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    placeholder="State"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    {...register("state", { required: "The state is required" })}
                  />
                  {errors.state && (
                    <span className="text-red-500 text-sm">{errors.state.message as string}</span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    placeholder="Zipcode"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    {...register("zipcode", { required: "The zipcode is required" })}
                  />
                  {errors.zipcode && (
                    <span className="text-red-500 text-sm">{errors.zipcode.message as string}</span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    placeholder="Country"
                    className="!w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    {...register("country", { required: "The country is required" })}
                  />
                  {errors.country && (
                    <span className="text-red-500 text-sm">{errors.country.message as string}</span>
                  )}
                </div>
              </div>
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
          {!isRegistering && (
            <p
              className="text-center mt-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password?
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default Login;
