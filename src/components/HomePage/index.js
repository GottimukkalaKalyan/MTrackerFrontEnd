import {Component} from "react"
import "./index.css"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"
import CreatingHistoryItem from "../creteHistoryItem"
import CreatingCreditHistoryItem from "../creteCreditHistoryItem"
import {v4 as uuid} from "uuid"

const amountConstants = {
   initial:"INITIAL",
   addToAvailable:"AVAILABLE BALANCE",
   credit:"CREDIT",
   debit:"DEBIT",
}

const initialApiStatusList = {
   initial:"INITIAL",
   inProgress:"IN_PROGRESS",
   failure:"FAILURE",
   success:"SUCCESS"
}


class Home extends Component{
   state = {
      AvailableBalance:0,
      CreditFromUser:0,
      CreditToUser:0,
      AddToAvailable:0,
      AddingValue:amountConstants.initial,
      inputAmount:"",
      logOut:false,
      UserName:"",
      creditorName:"",
      creditorNumber:"",
      creditorDate:"",
      debitorName:"",
      debitorNumber:"",
      debitorDate:"",
      creditorsUsersData:[],
      debitorsUsersData:[],
      apiStatus:initialApiStatusList.initial,
   }

   componentDidMount() {
      this.getUserData()
   }

   getUserData = async () => {
      this.setState({apiStatus:initialApiStatusList.inProgress})
      const UserNumber = Cookies.get("UserNumber")
      const UserDataUrl = `https://mtracker.onrender.com/amount/${UserNumber}`
      const result = await fetch(UserDataUrl)
      const data = await result.json()
      if (result.ok){
         this.setState({AvailableBalance:data.available_balance,UserName:data.user_name})
      }

      const CreditUrl = `https://mtracker.onrender.com/credit/amount/${UserNumber}`
      const CreditResult = await fetch(CreditUrl)
      const CreditData = await CreditResult.json()
      if (CreditData[0].amount !== null){
         this.setState({CreditFromUser:CreditData[0].amount})
      }else{
         this.setState({CreditFromUser:0})
      }
      
      const DebitUrl = `https://mtracker.onrender.com/debit/amount/${UserNumber}`
      const DebitResult = await fetch(DebitUrl)
      const DebitData = await DebitResult.json()
      if (DebitData[0].amount !== null){
         this.setState({CreditToUser:DebitData[0].amount})
      }else{
         this.setState({CreditToUser:0})
      }


      const AllDebitsUrl = `https://mtracker.onrender.com/alldebits/${UserNumber}`
      const DebitUsersList = await fetch(AllDebitsUrl)
      const DebitUsersListData = await DebitUsersList.json()
      const updatedUserList = DebitUsersListData.map(eachUser => ({
         id:eachUser.uid,
         amount:eachUser.amount,
         debitorName:eachUser.debitor_name,
         debitorNumber:eachUser.debitor_number,
         date:eachUser.date,
      }))
      this.setState({debitorsUsersData:updatedUserList})

      const AllCreditsUrl = `https://mtracker.onrender.com/allcredits/${UserNumber}`
      const CreditUsersList = await fetch(AllCreditsUrl)
      const CreditUsersListData = await CreditUsersList.json()
      const updatedCreditUserList = CreditUsersListData.map(eachUser => ({
         id:eachUser.uid,
         amount:eachUser.amount,
         debitorName:eachUser.creditor_name,
         debitorNumber:eachUser.creditor_number,
         date:eachUser.date,
      }))
      this.setState({creditorsUsersData:updatedCreditUserList,apiStatus:initialApiStatusList.success})
   }

   addAmount = async () => {
      const {AvailableBalance,inputAmount} = this.state
      const UserNumber = Cookies.get("UserNumber")
      const AfterAddedAmount = AvailableBalance + parseInt(inputAmount)
      const updateApiUrl = `https://mtracker.onrender.com/getUserDetails`
      const userDetails = {
         amount:AfterAddedAmount,
         mobileNumber:UserNumber
      }
      const jwtToken = Cookies.get("jwt_token")
      const options = {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           Authorization:`Bearer ${jwtToken}`,
         },
         body: JSON.stringify(userDetails)
       };

      const confiramation = window.confirm("Are you sure want to add amount to Available balance.?")
      if (confiramation){
         const data = await fetch(updateApiUrl,options)
         await this.getUserData()
         if (data.ok){
            this.setState({AddingValue:amountConstants.initial,inputAmount:"",})
            alert("Addedd Success")
         }
      }
   }

   creditAmount = async () => {
      const {inputAmount,creditorName,creditorNumber,creditorDate} = this.state
      const UserNumber = Cookies.get("UserNumber")
      if (creditorName !== "" && creditorNumber !== "" && creditorDate !== "" && UserNumber !== ""){
         const userData = {
            UserNumber:UserNumber,
            creditorName:creditorName,
            creditorNumber:creditorNumber,
            date:creditorDate,
            amount:inputAmount
         }
         const postingUrl = "https://mtracker.onrender.com/addAmountToCredit"
         const jwtToken = Cookies.get("jwt_token")
         const option = {
            method:"POST",
            headers:{
               'Content-Type': 'application/json',
               Authorization:`Bearer ${jwtToken}`,
            },
            body:JSON.stringify(userData)
         }
         const confiramation = window.confirm("Are you sure want to add amount to Credit..?")
         if (confiramation){
            const response = await fetch(postingUrl,option)
            const data = await response.json()
            if (response.ok){
               this.setState({
                  UserName:"",
                  creditorName:"",
                  creditorNumber:"",
                  creditorDate:"",
                  debitorName:"",
                  debitorNumber:"",
                  debitorDate:"",
                  inputAmount:"",
                  AddingValue:amountConstants.initial,
               })
               await this.getUserData()
               alert(data.message)
            }else{
               alert(data.message)
            }
         }
      }else{
         alert("Please fill all the Details")
      }
   }

   debitAmount = async () => {
      const {inputAmount,debitorName,debitorNumber,debitorDate} = this.state
      const UserNumber = Cookies.get("UserNumber")
      if (debitorName !== "" && debitorNumber !== "" && debitorDate !== "" && UserNumber !== ""){
         const userData = {
            UserNumber:UserNumber,
            debitorName:debitorName,
            debitorNumber:debitorNumber,
            date:debitorDate,
            amount:inputAmount
         }
         const postingUrl = "https://mtracker.onrender.com/addAmountToDebit"
         const jwtToken = Cookies.get("jwt_token")
         const option = {
            method:"POST",
            headers:{
               'Content-Type': 'application/json',
                Authorization:`Bearer ${jwtToken}`,
            },
            body:JSON.stringify(userData)
         }
         const confiramation = window.confirm("Are you sure want to add amount to Debit..?")
         if (confiramation){
            const response = await fetch(postingUrl,option)
            const data = await response.json()
            if (response.ok){
               alert(data.message)
               this.setState({
                  UserName:"",
                  creditorName:"",
                  creditorNumber:"",
                  creditorDate:"",
                  debitorName:"",
                  debitorNumber:"",
                  debitorDate:"",
                  inputAmount:"",
                  AddingValue:amountConstants.initial,
               })
               this.getUserData()
            }else{
               alert(data.message)
            }
         }
      }else{
         alert("Please fill all the Details")
      }
   }

   changeCreditorName = (event) => {
      this.setState({creditorName:event.target.value})
   }
   changeCreditorMobileNumber = (event) => {
      this.setState({creditorNumber:event.target.value})
   }
   changeDateOfGive = (event) => {
      this.setState({creditorDate:event.target.value})
   }

   changeDebitorName = (event) => {
      this.setState({debitorName:event.target.value})
   }
   changeDebitorMobileNumber = (event) => {
      this.setState({debitorNumber:event.target.value})
   }
   changeDebitorDateOfGive = (event) => {
      this.setState({debitorDate:event.target.value})
   }

   submitForm = (event) => {
      event.preventDefault()
      const {AddingValue} = this.state
      switch (AddingValue) {
         case amountConstants.addToAvailable:
            return this.addAmount()
         case amountConstants.credit:
            return this.creditAmount()
         case amountConstants.debit:
            return this.debitAmount()
         default:
            return null
      }
   }

   changeAmount = (event) => {
      this.setState({inputAmount:event.target.value})
   }

   changeOption = (event) => {
      this.setState({AddingValue:event.target.value})
   } 

   accessFromUserForm = () => {
      const {creditorName,creditorDate,creditorNumber} = this.state
      return(
         <>
            <div className="input-field mt-2">
               <label htmlFor="creditorName" className="label mb-1">Creditor Name</label>
               <input type="text" value={creditorName} className="form-control" id="creditorName" onChange={this.changeCreditorName} placeholder="Enter Creditor Name"/>
            </div>
            <div className="input-field mt-2">
               <label htmlFor="creditorNumber" className="label mb-1">Creditor Number</label>
               <input type="number" value={creditorNumber} className="form-control" id="creditorNumber" onChange={this.changeCreditorMobileNumber} placeholder="Enter Mobile number"/>
            </div>
            <div className="input-field mt-2">
               <label htmlFor="creditorDate" className="label mb-1">Date</label>
               <input type="date" value={creditorDate} className="form-control" id="creditorDate" onChange={this.changeDateOfGive} placeholder="Select Date of Given"/>
            </div>
         </>
      )
   }
   accessToUserForm = () => {
      return(
         <>
            <div className="input-field mt-2">
               <label htmlFor="debitName" className="label mb-1">Debitor Name</label>
               <input type="text" className="form-control" id="debitName" onChange={this.changeDebitorName} placeholder="Enter Debitor Name"/>
            </div>
            <div className="input-field mt-2">
               <label htmlFor="debitNumber" className="label mb-1">Debitor Number</label>
               <input type="number" className="form-control" id="debitNumber" onChange={this.changeDebitorMobileNumber} placeholder="Enter Mobile number"/>
            </div>
            <div className="input-field mt-2">
               <label htmlFor="debitDate" className="label mb-1">Date</label>
               <input type="date" className="form-control" id="debitDate" onChange={this.changeDebitorDateOfGive} placeholder="Select Date of Given"/>
            </div>
             
         </>
      )
   }
   accessAddingForm = () => {
      return(
         <div className="input-field mt-3">
            <h4>Click add button to add amount to Available Balance</h4>
         </div>
      )
   }
   getBottomForm = () => {
      const {AddingValue} = this.state
      switch (AddingValue) {
         case amountConstants.addToAvailable:
            return this.accessAddingForm()
         case amountConstants.credit:
            return this.accessFromUserForm()
         case amountConstants.debit:
            return this.accessToUserForm()
         default:
            return null
      }
   }
   logOutButton = () => {
      const a = window.confirm("Are you sure want to logout")
      if (a){
         Cookies.remove("jwt_token")
         Cookies.remove("UserNumber")
         this.setState({logOut:true})
         return <Navigate to="/login" />
      }
      
   }

   deleteDebitor = async (UserData) => {
      const DeleteDebitorApi = `https://mtracker.onrender.com/delete/Debitor`
      const jwtToken = Cookies.get("jwt_token")
      const options = {
         method:"DELETE",
         headers:{
            'Content-Type':'application/json',
             Authorization: `Bearer ${jwtToken}`,
         },
         body:JSON.stringify(UserData)
      }
      const DeleteResponse = await fetch(DeleteDebitorApi,options)
      const DeleteMsg = await DeleteResponse.json()
      if (DeleteResponse.ok){
         this.getUserData()
         alert(DeleteMsg.message)
      }
   }
   deleteCreditor = async (UserData) => {
      console.log(UserData)
      const DeleteCreditorApi = `https://mtracker.onrender.com/delete/Creditor`
      const jwtToken = Cookies.get("jwt_token")
      const options = {
         method:"DELETE",
         headers:{
            'Content-Type':'application/json',
             Authorization: `Bearer ${jwtToken}`,
         },
         body:JSON.stringify(UserData)
      }
      const DeleteResponse = await fetch(DeleteCreditorApi,options)
      const DeleteMsg = await DeleteResponse.json()
      if (DeleteResponse.ok){
         this.getUserData()
         alert(DeleteMsg.message)
      }
   }

   getDebtedListOfData = () => {
      const {debitorsUsersData} = this.state
      const NothingToShow = debitorsUsersData.length === 0

      return(
         <ul className="ul-container">
            <li className="bg-danger-subtle border border-primary-subtle rounded-3 list-headings mb-2">
               <p className="headings">Name</p>
               <p className="headings">Amount</p>
               <p className="headings">Call</p>
               <p className="headings">Date</p>
               <p className="headings">Delete</p>
            </li>
            {NothingToShow ? (
               <div className="bg-primary-subtle border border-primary-subtle rounded-3 list-headings mb-2 nothing-container">
                  <p className="nothing-para">Nothing to Show.!</p>
               </div>
            )
             :
             debitorsUsersData.map(eachOne => (
               <CreatingHistoryItem Data={eachOne} key={uuid()} deleteUser={this.deleteDebitor}/>
            ))
             }
         </ul>
      )
   }

   getCreditedListOfData = () => {
      const {creditorsUsersData} = this.state
      const NothingToShow = creditorsUsersData.length === 0
      return(
         <ul className="ul-container">
            <li className="bg-danger-subtle border border-primary-subtle rounded-3 list-headings mb-2">
               <p className="headings">Name</p>
               <p className="headings">Amount</p>
               <p className="headings">Call</p>
               <p className="headings">Date</p>
               <p className="headings">Delete</p>
            </li>
            {NothingToShow ? (
               <div className="bg-primary-subtle border border-primary-subtle rounded-3 list-headings mb-2 nothing-container">
                  <p className="nothing-para">Nothing to Show.!</p>
               </div>
            )
             :
               creditorsUsersData.map(eachOne => (
                  <CreatingCreditHistoryItem Data={eachOne} key={uuid()} deleteDebitUser={this.deleteCreditor}/>
               ))
            }
            
         </ul>
      )
   }

   loading = () => (
      <div class="loading-view">
         <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
         <span role="status">Loading...</span>
      </div>
   )

   Debitloading = () => (
      <div class="debit-loading-view">
         <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
         <span role="status">Loading...</span>
      </div>
   )


   render(){
      const {AvailableBalance,CreditFromUser,CreditToUser,AddingValue,inputAmount,UserName,apiStatus} = this.state
      const ProfitOrLoss = (((AvailableBalance+CreditFromUser) - CreditToUser) < 0) ? "Loss" : "Profit"
      const ProfitLossClassName = ProfitOrLoss === "Loss" ? "loss" : "profit-loss"
      const FinalAmount = (AvailableBalance+CreditFromUser) - CreditToUser
      const firstWord = String(UserName[0])
      const CapitalUSerName = firstWord.toUpperCase() + String(UserName.slice(1,))
      const AvailableBalanceAmountShowing = apiStatus === initialApiStatusList.inProgress ? this.loading() : AvailableBalance
      const CreditFromUserAmountShowing = apiStatus === initialApiStatusList.inProgress ? this.loading() : CreditFromUser
      const CreditToUserAmountShowing = apiStatus === initialApiStatusList.inProgress ? this.Debitloading() : CreditToUser
      const FinalAmountAmountShowing = apiStatus === initialApiStatusList.inProgress ? this.loading() : FinalAmount
      const UserNameLoadingView = apiStatus === initialApiStatusList.inProgress ? this.loading() : CapitalUSerName
      
      const jwtToken = Cookies.get("jwt_token")
      if (jwtToken === undefined){
         return <Navigate to="/login" />
      }
      return(
         <div className="main-container">
            <nav className="navbar-container">
               <div className="names-card">
                  <h1 className="welcome-name">Welcome to MTracker &#160; </h1>
                  <h1 className="welcome-name titles">Mr. {UserNameLoadingView}</h1>
               </div>
               <button type="button" className="btn btn-danger" onClick={this.logOutButton}>Logout</button>
            </nav>
            <div className="home-container">
               {/* <h1 className="home-page-heading">Home Page</h1> */}
               <div className="dash-board-cards-container">
                  <div className="dash-board">
                     <h5>Available Balance</h5>
                     <h1 className="titles">₹ {AvailableBalanceAmountShowing} /-</h1>
                  </div>
                  {/* <div className="dash-board">
                     <h5>Credits</h5>
                     <h1 className="titles">₹ {CreditFromUser} /-</h1>
                  </div> */}
                  <button type="button" class="debit-and-credit-button dash-board" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                     <div className="dash-board">
                        <h5>Credits</h5>
                        <h1 className="titles">₹ {CreditFromUserAmountShowing} /-</h1>
                     </div>
                  </button>
                  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog">
                     <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">All Creditors list</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        {this.getCreditedListOfData()}
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {/* <button type="button" class="btn btn-primary">Okay</button> */}
                        </div>
                     </div>
                  </div>
                  </div>
                  {/* <div className="dash-board">
                     <h5>Debits</h5>
                     <h1 className="title-credit-to">₹ {CreditToUser} /-</h1>
                  </div> */}
                  <button type="button" class="debit-and-credit-button dash-board" data-bs-toggle="modal" data-bs-target="#debitorsToggle">
                     <div className="dash-board">
                        <h5>Debits</h5>
                        <h1 className="title-credit-to">₹ {CreditToUserAmountShowing} /-</h1>
                     </div>
                  </button>
                  <div class="modal fade" id="debitorsToggle" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog">
                     <div class="modal-content">
                        <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">All Debitors list</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        {this.getDebtedListOfData()}
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        {/* <button type="button" class="btn btn-primary">Understood</button> */}
                        </div>
                     </div>
                  </div>
                  </div>

                  <div className="dash-board">
                     <h5> Profit & Loss</h5>
                     <h1 className={ProfitLossClassName}>{ProfitOrLoss}</h1>
                  </div>
               </div>
               <div className="final-value-container">
                  <div className="final dash-board-cards-container mt-3 mb-3">
                     <div className="final-value-dash-board">
                        <div>
                           <h5>Final Value</h5>
                           <h1 className={ProfitLossClassName}><span className="titles"> ₹ {FinalAmountAmountShowing}  /-</span></h1>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="rgb(21, 231, 21)" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                           <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                     </div>
                  </div>
               </div>
               <div className="form-container">
                  <form className="form-tag shadow" onSubmit={this.submitForm}>
                     <div className="input-field">
                        <label htmlFor="amount" className="label mb-1">Amount</label>
                        <input type="number" className="form-control" id="amount" value={inputAmount} onChange={this.changeAmount} placeholder="Enter amount"/>
                     </div>
                     <div className="input-field mt-2">
                        <label htmlFor="mode" className="label mb-1">Mode</label>
                        <select className="form-control" id="mode" onChange={this.changeOption} value={AddingValue}>
                           <option>Select mode of transaction</option>
                           <option value="AVAILABLE BALANCE">Add to Available Balance</option>
                           <option value="CREDIT">Credit</option>
                           <option value="DEBIT">Debit</option>
                        </select>
                     </div>
                     {this.getBottomForm()}
                     <button type="submit" className="btn btn-primary mt-3">Add</button>
                     {AddingValue === amountConstants.addToAvailable && <p className="mt-2 note"><b>Note:-</b> If you're trying to decrease the amount please add (-) before amount Ex (-100) </p>}
                  </form>
               </div>
            </div>
         </div>
      )
   }
}

export default Home