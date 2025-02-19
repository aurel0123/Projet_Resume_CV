// filepath: /c:/Users/CHRISTO/Downloads/Projet_Resume_CV/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./composant/Home";
import Register from "./composant/pages/Register";
import Login from "./composant/pages/Login";
import Dashbord from "./composant/dashbord";
import DashboardUser from './composant/dashborduser/Dashboard'
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import MesJobs from './composant/dashborduser/MesJobs';
import Profile from './composant/dashborduser/Profile';
import Liked from './composant/dashborduser/Liked';
import Dashboardadmin from './composant/dashboardAdmin/Dashboardadmin';
import OffresEmploi from './composant/dashboardAdmin/OffresEmploi';
import Candidature from './composant/dashboardAdmin/Candidature';
import CandidaturesList from './composant/dashboardAdmin/CandidaturesList';
import DashHome from './composant/dashboardAdmin/Home';
import Details from './composant/pages/Details'
function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offres/:id" element={<Details />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashbord" element={<PrivateRoute element={<Dashbord />} userType={["Entreprise"]} />}  />
        <Route path='/interfaceuser' element={<PrivateRoute element={<DashboardUser/>} allowTypes={["Candidat"]}/>}   >
          <Route index element={<Liked/>} /> 
          <Route path="profile" element={<Profile/>} />
          <Route path="offers" element={<MesJobs/>} />
        </Route>
        <Route path='/dashboardAdmin' element={<PrivateRoute element={<Dashboardadmin/>} allowTypes={["Entreprise", "Recruteur"]} />} >
          <Route index element={<DashHome/>} /> 
          <Route path='offresemplois' element = {<OffresEmploi/>}/>
          <Route path='candidatures' element={<Candidature/>} />
          <Route path='candidatures/candidatureListes/:offreId' element ={<CandidaturesList/>} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;