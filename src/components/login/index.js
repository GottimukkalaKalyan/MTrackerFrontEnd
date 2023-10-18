import {useState, useEffect} from "react"
import Cookies from "js-cookie"
import {Link, Navigate} from "react-router-dom"

import "./index.css"

const initialApiStatusList = {
   initial:"INITIAL",
   inProgress:"IN_PROGRESS",
   failure:"FAILURE",
   success:"SUCCESS"
}

const Login1 = () => {
   const [showPassword, setShowPassword] = useState(false)
   const [mobileNumber, setMobileNumber] = useState("")
   const [password, setPassword] = useState("")
   const [isLoggedIn, setLoggedIn] = useState(false)
   const [showErrorMsg, setShowErrorMsg] = useState(false)
   const [ErrorMsg, setErrorMsg] = useState("")
   const [ApiStatus, setApiStatus] = useState(initialApiStatusList.initial)

   useEffect(() => {
    }, []); 

    const LoginToPortal = async (event) => {
      event.preventDefault()
      setApiStatus(initialApiStatusList.inProgress)
      const loginUrl = "https://mtracker.onrender.com/login"
      const userData = {
         mobileNumber:mobileNumber,
         password:password
      }

      const options = {
         method: "POST",
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(userData),
      }
      if (mobileNumber !== "" && password !== ""){
         const response = await fetch(loginUrl,options)
         const responseData = await response.json()
         if (response.ok){
            loginSuccess(responseData.jwtToken)
         }else{
            loginFailure(responseData.message)
         }
      }else{
         setShowErrorMsg(true)
         if (mobileNumber === ""){
            setErrorMsg("Please Enter Registered Mobile Number")
         }else{
            setErrorMsg("Please Enter Password")
         }
      }
   }

   const changeNumber = (event) => {
      setMobileNumber(event.target.value)
   }
   const changePassword = (event) => {
      setPassword(event.target.value)
   }
   const clickToShowPassword = (event) => {
      setShowPassword(event.target.checked)
   }
   const loginSuccess = jwtToken => {
      Cookies.set("jwt_token", jwtToken, {expires:30})
      Cookies.set("UserNumber", mobileNumber, {expires:30})
      setLoggedIn(true)
      setApiStatus(initialApiStatusList.success)
   }
   const callToLogin = () => {
      switch (ApiStatus) {
         case initialApiStatusList.inProgress:
            return LOadingView()
         case initialApiStatusList.success:
            return null
         default:
            return null
      }
   }

   const loginFailure = (message) => {
      setShowErrorMsg(true)
      setErrorMsg(message)
      setApiStatus(initialApiStatusList.failure)
   }

   const LOadingView = () => (
      <div class="d-flex justify-content-center">
         <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
         </div>
      </div>
    )

   const isPassword = showPassword ? "text" : "password"
   const TextOfPassword = showPassword ? "Hide Password" : "Show Password"

   if (isLoggedIn){
      return <Navigate to="/" />
   }
   return(
      <div className="login-page-main-container">
         <form className="login-form-container shadow" onSubmit={LoginToPortal}>
            {callToLogin()}
            <div class="mb-3">
               <label for="exampleInputEmail1" class="form-label"><b>Mobile Number</b></label>
               <input type="tel" class="form-control" id="exampleInputEmail1" maxLength={10} value={mobileNumber} onChange={changeNumber}/>
               <div id="emailHelp" class="form-text">We'll never share your mobile number with anyone else.</div>
            </div>
            <div class="mb-3">
               <label for="exampleInputPassword1" class="form-label"><b>Password</b></label>
               <input type={isPassword} class="form-control" id="exampleInputPassword1" value={password} onChange={changePassword}/>
            </div>
            <div class="mb-3 form-check">
               <input type="checkbox" class="form-check-input" value={showPassword} id="exampleCheck1" onChange={clickToShowPassword}/>
               <label class="form-check-label" for="exampleCheck1"><b>{TextOfPassword}</b></label>
            </div>
            {showErrorMsg && <p className="error-msg mb-2">{ErrorMsg}</p>}
            <div className="buttons-container">
               <button type="submit" class="btn btn-primary w-100">Login</button>
               <Link to="/register" className="w-100">
                  <button type="button" class="btn btn-secondary w-100">Register</button>
               </Link>
            </div>
         </form>
      </div>
   )
}

export default Login1