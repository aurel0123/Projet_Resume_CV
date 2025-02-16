import {useContext} from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function PrivateRoute({element, userType=[]}) {

    const { user } = useContext(AuthContext);

    if (!user){
        return <Navigate to="/login" />;
    }
    if (userType.length && !userType.includes(user.user_type)){
        return <Navigate to="/unauthorized" />;
    }
    return element ; 

}

export default PrivateRoute