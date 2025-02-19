import { useState, useContext } from "react"
import { authService } from "../../services/AuthService"
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from "../../Context/AuthContext";
import {useNavigate} from 'react-router-dom'
import {Link} from 'react-router-dom'
const Register = () => {
  const navigate = useNavigate()
  const [formdata , setFormdata] = useState({
    email: '',
    password: '',
  })
  const  resetForm = () => {
  setFormdata({
    email: '',
    password: '',
  })
}
const { login } = useContext(AuthContext);
  
  const handlechange = (e) => {
    const {name , value} = e.target
    setFormdata((prev)=>(
      {
        ...prev,
        [name]: value
      }
    ))
  }
  const handleSubmit = async (e) =>{
    e.preventDefault()
      try{
        const response =  await authService.login(formdata)
        console.log('Réponse du serveur :', response);
        resetForm()
        console.log(response)
        toast.success('Connexion réussie'); 
        login(response); 
        navigate('/')
        
      }catch(e){
        console.log(e)
        toast.error('Erreur de connexion');
      }
  }
  return (
    <div className='login'>
      <Toaster/>

<div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff]  shadow-xl">
    <div className="flex flex-row gap-3 pb-4 justify-center items-center text-center">
        <div>
            <img src="src/assets/img/export.png" alt="Logo" className="w-10 h-10"/>
        </div>
        <h1 className="text-2xl font-bold text-[#4B5563] my-auto">JobFindr</h1>

    </div>
    <h1 className="text-2xl font-bold text-[#4B5563] my-auto text-center">Bienvenue à JobFindr</h1>
    <div className="text-sm font-light text-[#6B7280] pb-8 text-center">Veuillez vous connecter à votre compte et commencer l'aventure</div>
    <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="pb-2">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#111827]">Email</label>
            <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                <input type="email" name="email" id="email" className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="name@company.com" autoComplete="off"
                value={formdata.email}
                onChange={handlechange}        
                />
            </div>
        </div>
        <div className="pb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#111827]">Mots de passe</label>
            <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-asterisk"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M12 8v8"></path><path d="m8.5 14 7-4"></path><path d="m8.5 10 7 4"></path></svg></span> 
                <input type="password" name="password" id="password" placeholder="••••••••••" className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autoComplete="new-password" aria-autocomplete="list"
                value={formdata.password}
                onChange= {handlechange}
                />
            </div>
        </div>
        <div className="">
              <div className="flex items-center justify-between mb-5">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember-me"/>
                  <label className="form-check-label" htmlFor="remember-me">
                    Souvenez-vous de moi
                  </label>
                </div>
                <a href="" className='text-[#696cff] hover:underline'>
                  <span>Mots de passe oublié?</span>
                </a>
              </div>
            </div> 
        <button type="submit" className="w-full text-[#FFFFFF] bg-[#696cff] focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">Se connecter</button>
        <div className="text-sm font-light text-[#6B7280] text-center">Nouveau sur notre plateforme ? <Link to ="/register" className="font-medium text-[#696cff] hover:underline"> Créer un compte</Link>

        </div>
    </form>
</div>

    </div>
  )
}

export default Register