import './App.css';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from './components/HomePage';
// import History from './components/HistoryPage';
import Login from './components/login';
import RegisterUser from './components/register';
// import ProtectedRoute from './components/authenticate';
// import Cookies from 'js-cookie';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<RegisterUser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
