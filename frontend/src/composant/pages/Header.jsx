
import { Link } from 'react-router-dom';
import React from 'react';
import Button from './theme/Button';
import Container from './theme/Container';
import jobssign2 from '../../assets/img/jobssign2.jpg';

function Header() {
  return (
    <div className="Header h-60" style={{ 
      backgroundImage: `url(${jobssign2})`, 
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'}}>

      <div className="max-w-[80rem] mx-auto Tete">
        
            <div className="Title">
              <img src="src/assets/img/export.png" className="w-10 h-10" alt="" />
              <h3 className="p-2 text-log">JobFindr</h3>
            </div>

            <div>
              <ul className="Menu">
                <li>
                  <a href="#">Trouver un job</a> 
                </li>
                <li>
                  <a href="">Mes jobs</a>
                </li>
                <li>
                  <a href="">Postuler à un job</a>
                </li>
              </ul>
            </div>
              
            <div className="gap-2 Button">
            <Link to='/login'>
            <Button className='text-white btn-sm' theme='primary'>
              Connexion
            </Button>
            </Link>
            <Link to='/register'>
              <Button className='hover:text-white btn-sm text-[#4361ee]' theme='secondary'>
                Inscription
              </Button>
            </Link>
            </div>
      </div>
      <Container className='space-y-10'>
        <h2 className="tex">Rechercher un job ici...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
        <form className="flex items-center space-x-2">
          <input 
            type="search" 
            placeholder="Entrer le job ou un mot clé" 
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 inBar1"
          />
        </form>

        <form className="flex items-center space-x-2 Bar">
          <input 
            type="search" 
            placeholder="Entrer la localisation" 
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 inBar"
          />
          <button 
            type="submit" 
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 Bout"
          >
           search
          </button>
        </form>
        </div>
      </Container>
    </div>
  );
}

export default Header;