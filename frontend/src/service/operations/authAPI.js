import { toast } from "react-hot-toast"

import { setLoading, setToken, setUser } from "../../slices/authSlice"

import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const {
  SIGNUP_API,
  LOGIN_API,
} = endpoints

// Complete signup with email, password, name, and role
export function signUp(name, email, password, confirmPassword, role, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    const toastId = toast.loading("Creating your account...")
    
    try {
      console.log("API Call - Signup endpoint:", endpoints.SIGNUP_API)
      console.log("Sending signup data:", {
        name,
        email,
        role,
        password: "****",
        confirmPassword: "****"
      });
      
      const response = await apiConnector("POST", endpoints.SIGNUP_API, {
        name,
        email,
        password,
        confirmPassword,
        role,
      })

      console.log("Full Response:", response)
      console.log("Response Status:", response.status)
      console.log("Response Data:", response.data)

      const responseData = response.data
      
      // Check if we got token in response
      if (!responseData || !responseData.token) {
        throw new Error(responseData?.message || "No token in response")
      }
      
      // Save to Redux
      dispatch(setToken(responseData.token))
      dispatch(setUser(responseData.user))
      
      // Save to localStorage
      localStorage.setItem("token", responseData.token)
      localStorage.setItem("user", JSON.stringify(responseData.user))
      
      dispatch(setLoading(false))
      toast.dismiss(toastId)
      toast.success("Account created successfully!")
      
      // Navigate to dashboard based on role
      setTimeout(() => {
        const userRole = responseData.user?.role || "user"
        if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true })
        } else {
          navigate("/dashboard/my-profile", { replace: true })
        }
      }, 1000)
      
      return responseData
      
    } catch (error) {
      console.error("Signup Error Full:", error)
      console.error("Error Response:", error.response)
      console.error("Error Message:", error.message)
      
      const errorMsg = error.response?.data?.message || error.message || "Signup failed"
      
      dispatch(setLoading(false))
      toast.dismiss(toastId)
      toast.error(errorMsg)
      
      throw error
    }
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true))
    const toastId = toast.loading("Logging in...")
    
    try {
      console.log("Login endpoint:", LOGIN_API)
      console.log("Sending login data:", { email, password: "****" })
      
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN RESPONSE:", response)
      console.log("Response Data:", response.data)

      const responseData = response.data
      
      // Check if we got token in response
      if (!responseData || !responseData.token) {
        throw new Error(responseData?.message || "No token in response")
      }

      // Extract user data with role
      const userData = responseData.user
      const userRole = userData.role || "user"

      // Save to Redux
      dispatch(setToken(responseData.token))
      dispatch(setUser({
        ...userData,
        role: userRole,
      }))
      
      // Store in localStorage
      localStorage.setItem("token", responseData.token)
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        role: userRole,
      }))
      
      dispatch(setLoading(false))
      toast.dismiss(toastId)
      toast.success(`Login Successful! Welcome ${userData.name}`)
      
      // Navigate based on role after a delay
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true })
        } else {
          navigate("/dashboard/my-profile", { replace: true })
        }
      }, 1000)
      
      return responseData
      
    } catch (error) {
      console.error("Login Error Full:", error)
      console.error("Error Response:", error.response)
      console.error("Error Message:", error.message)
      
      const errorMsg = error.response?.data?.message || error.message || "Login failed"
      
      dispatch(setLoading(false))
      toast.dismiss(toastId)
      toast.error(errorMsg)
      
      throw error
    }
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
   
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}


