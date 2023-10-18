import {useState, useEffect} from "react"
import {Link, Navigate} from "react-router-dom"
import {v4 as uuid} from "uuid"

import "./index.css"

const initialApiStatusList = {
   initial:"INITIAL",
   inProgress:"IN_PROGRESS",
   failure:"FAILURE",
   success:"SUCCESS"
}

const RegisterUser = () => {
   const [showPassword, setShowPassword] = useState(false)
   const [UserMobileNumber, setMobileNumber] = useState("")
   const [UserName, setUserName] = useState("")
   const [AvailableBalance, setAvailableBalance] = useState(0)
   const [UserPassword, setPassword] = useState("")
   const [isRegistered, setRegistered] = useState(false)
   const [showErrorMsg, setShowErrorMsg] = useState(false)
   const [ErrorMsg, setErrorMsg] = useState("")
   const [ApiStatus, setApiStatus] = useState(initialApiStatusList.initial)

   useEffect(() => {
    }, []); 

    const LOadingView = () => (
      <button class="btn btn-primary" type="button" disabled>
         <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
         <span role="status">Creating...</span>
      </button>
    )

    const RegisterNewUser = async (event) => {
      event.preventDefault()
      setApiStatus(initialApiStatusList.inProgress)
      const uid = uuid()
      const registerUrl = "https://mtracker.onrender.com/register"
      const userData = {
         MobileNumber:UserMobileNumber,
         UserName:UserName,
         Password:UserPassword,
         AvailableBalance:parseInt(AvailableBalance),
         uid:uid,
      }
      const options = {
         method: "POST",
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(userData),
      }
      if (UserMobileNumber !== "" && UserPassword !== "" && UserName !== ""){
         const response = await fetch(registerUrl,options)
         const responseData = await response.json()
         if (response.ok){
            registerSuccess(responseData.message)
            setApiStatus(initialApiStatusList.success)
         }else{
            registerFailure(responseData.message)
            setApiStatus(initialApiStatusList.failure)
         }
      }else{
         setShowErrorMsg(true)
         if (UserMobileNumber === ""){
            setErrorMsg("Please Enter Registered Mobile Number")
         }else{
            setErrorMsg("Please Enter Password")
         }

      }
   }
   const changeUserName = (event) => {
      setUserName(event.target.value)
   }
   const addAvailable = (event) => {
      setAvailableBalance(event.target.value)
   }
   const changeUserNumber = (event) => {
      setMobileNumber(event.target.value)
   }
   const changeUserPassword = (event) => {
      setPassword(event.target.value)
   }
   const clickToShowPassword = (event) => {
      setShowPassword(event.target.checked)
   }
   const registerSuccess = (message) => {
      setRegistered(true)
      setShowErrorMsg(false)
      setApiStatus(initialApiStatusList.success)
      alert(message)

   }
   const registerFailure = (message) => {
      setShowErrorMsg(true)
      setErrorMsg(message)
   }
   const getLoadingStatus = () => {
      switch (ApiStatus) {
         case initialApiStatusList.inProgress:
            return LOadingView()
         case initialApiStatusList.success:
            return null
         default:
            return null
      }
   }

   const isPassword = showPassword ? "text" : "password"

   if (isRegistered){
      return <Navigate to="/login" />
   }
   return(
      <div className="login-page-main-container">
         <form className="login-form-container shadow" onSubmit={RegisterNewUser}>
            {getLoadingStatus()}
            <div class="mb-3">
               <label for="nameOfTheUser" class="form-label"><b>Name of the User</b></label>
               <input type="text" class="form-control" id="nameOfTheUser" value={UserName} onChange={changeUserName}/>
            </div>
            <div class="mb-3">
               <label for="userMobileNumber" class="form-label"><b>Mobile Number</b></label>
               <input type="tel" class="form-control" id="userMobileNumber" maxLength={10} value={UserMobileNumber} onChange={changeUserNumber}/>
            </div>
            <div class="mb-3">
               <label for="userPassword" class="form-label"><b>Password</b></label>
               <input type={isPassword} class="form-control" id="userPassword" value={UserPassword} onChange={changeUserPassword}/>
            </div>
            <div class="mb-3 form-check">
               <input type="checkbox" class="form-check-input" value={showPassword} id="showingPassword" onChange={clickToShowPassword}/>
               <label class="form-check-label" for="showingPassword"><b>{showPassword ? "Hide Password" : "Show Password"}</b></label>
            </div>
            <div class="mb-3">
               <label for="availableBalance" class="form-label"><b>Available Balance</b></label>
               <input type="tel" class="form-control" id="availableBalance" value={AvailableBalance} onChange={addAvailable}/>
            </div>
            {showErrorMsg && <p className="error-msg mb-2">{ErrorMsg}</p>}
            <div className="buttons-container">
               <Link to="/login" className="w-100">
                  <button type="button" class="btn btn-secondary w-100">Login</button>
               </Link>
               <button type="submit" class="btn btn-primary w-100">Register</button>               
            </div>
            <div id="emailHelp" class="form-text">We'll never share your Details with anyone else.</div>
         </form>
      </div>
   )
}

export default RegisterUser