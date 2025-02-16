import { useState } from "react"
import { authService } from "../../services/AuthService"
import toast, { Toaster } from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'
const Register = () => {
  const navigate = useNavigate()
  const [formdata , setFormdata] = useState({
    email: '',
    password: '',
    userType: 'Candidat',
    phone: '',
    // Champs additionnels pour entreprise
    companyName: '',
    website: '',
    address: '',
    // Champs additionnels pour recruteur
    company: ''
  })
 const  resetForm = () => {
  setFormdata({
    email: '',
    password: '',
    userType: 'Candidat',
    phone: '',
    // Champs additionnels pour entreprise
    companyName: '',
    website: '',
    address: '',
    // Champs additionnels pour recruteur
    company: ''
  })
 }
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };
  
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

    if(!validatePassword(formdata.password)){
      alert("Votre mot ne respecte pas les exigences");
      return ; 
    }
      try{
        const response = await authService.register(formdata)
        console.log('Réponse du serveur :', response);
        resetForm()
        toast.success('Connexion réussie'); 
        navigate('/login')
        
      }catch(e){
        console.log(e)
      }
  }
  return (
<div className='register'>
    <Toaster/>
  <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff]  shadow-xl">
      <div className="flex flex-row items-center justify-center gap-3 pb-4 text-center">
          <div>
              <img src="src/assets/img/export.png" alt="Logo" className="w-10 h-10"/>
          </div>
            <h1 className="text-2xl font-bold text-[#4B5563]  my-auto">JobFindr</h1>

      </div>
    <h1 className="text-2xl font-bold text-[#4B5563] my-auto text-center">Bienvenue à JobFindr</h1>
    <div className="text-sm font-light text-[#6B7280] pb-8 text-center">Créez un compte</div>
    <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="pb-2">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#111827]">Email</label>
            <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                <input type="email" name="email" id="email" className=" form-controle pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="Your email" autoComplete="off"
                onChange={handlechange}
                value={formdata.email}
                
                />
            </div>
        </div>
        <div className="pb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#111827]">Mots de passe</label>
            <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-asterisk"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M12 8v8"></path><path d="m8.5 14 7-4"></path><path d="m8.5 10 7 4"></path></svg></span> 
                <input type="password" name="password" id="password" placeholder="••••••••••" className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" autoComplete="new-password" aria-autocomplete="list"
                required
                value={formdata.password}
                onChange={handlechange}
                />
            </div>
        </div>

        <div className="pb-2">
            <label htmlFor="userType" className="block mb-2 text-sm font-medium text-[#111827]">Votre profile</label>
            <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
            <select className="form-controle pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="Your email" autoComplete="off" aria-label="Default select example"
            name = "userType"
            value={formdata.userType}
            onChange={handlechange}
            >
              <option value="Candidat">Candidat</option>
              <option value="Entreprise">Entreprise</option>
              <option value="Recruteur">Recruteur</option>
            </select>
            </div>
        </div>
        {
          formdata.userType === 'Entreprise' && (
            <>
              <div className="pb-2">
                <label htmlFor="entreprise" className="block mb-2 text-sm font-medium text-[#111827]">Nom de l'entreprise</label>
                <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                    <input type="text" name="companyName" id="entreprise" className=" form-controle pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="Nom de votre entrprise" autoComplete="off"
                    value={formdata.companyName}
                    onChange={handlechange}
                    required
                    />
                </div>
              </div>
              <div className="pb-2">
                <label htmlFor="siteweb" className="block mb-2 text-sm font-medium text-[#111827]">site web</label>
                <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                    <input type="text" name="website" id="siteweb" className=" form-controle pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="Site Web" autoComplete="off"
                    value={formdata.website}
                    onChange={handlechange}
                    />
                </div>
              </div>
              <div className="pb-2">
                <label htmlFor="addresse" className="block mb-2 text-sm font-medium text-[#111827]">Votre addresse</label>
                <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                    <input type="text" name="address" id="addresse" className=" form-controle pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="Votre addresse" autoComplete="off"
                    value={formdata.address}
                    onChange={handlechange}
                    />
                </div>
              </div>
            </>
          )
        }
        {
          formdata.userType === 'Recruteur' && (
            <>
              <div className="pb-2">
                <label htmlFor="company" className="block mb-2 text-sm font-medium text-[#111827]">Compagny</label>
                <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                    <input type="text" name="company" id="company" className=" form-controle pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="Nom de votre Compagny" autoComplete="off"
                    value={formdata.company}
                    onChange={handlechange}
                    required
                    />
                </div>
              </div>
            </>
          )
        }
        <div className="pb-2">
            <label htmlFor="telephone" className="block mb-2 text-sm font-medium text-[#111827]">Telephone</label>
            <div className="relative text-gray-400"><span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></span> 
                <input type="tel" name="phone" id="telephone" className="form-controle pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-hidden focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4" placeholder="0190908767" autoComplete="off"
                  value={formdata.phone}
                  onChange={handlechange}
                />
            </div>
        </div>
        
        <div className="">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center justify-center form-check">
                  <input className="mr-2 form-check-input" type="checkbox" id="remember-me"/>
                  <label className="form-check-label " htmlFor="remember-me">
                    Souvenez-vous de moi
                  </label>
                </div>
                <a href="" className='text-[#696cff] hover:underline'>
                  <span>Mots de passe oublié?</span>
                </a>
              </div>
            </div> 
        <button type="submit" className="w-full text-[#FFFFFF] bg-[#696cff] focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">S'inscrire</button>
        <div className="text-sm font-light text-[#6B7280] text-center">Vous avez déjà un compte ? <a href="#" className="font-medium text-[#696cff] hover:underline">Connexion</a>

        </div>
    </form>
</div>

</div>
  )
}

export default Register