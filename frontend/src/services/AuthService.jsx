import axios from 'axios' ; 

const BASE_API_URL = 'http://localhost:8000/api' ;

export const authService = {
    login : (formdata) => (authService.request('login/', formdata)), 
    register : (formdata)=> authService.request('register/', formdata),

    request : async (endpoint, formdata) =>{
            try {
                const response = await axios.post(`${BASE_API_URL}/${endpoint}`,formdata,{
                    headers : {
                        'Content-Type': 'application/json'
                    }
                })
                
                return response.data

            }catch(e){
                console.log('Erreur de connexion ou d\'authentification',e)
        }
    }
}