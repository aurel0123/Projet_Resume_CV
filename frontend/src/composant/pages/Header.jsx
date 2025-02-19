import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, Search, LogOut } from 'lucide-react';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileMenu(false);
    navigate('/login');
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    setShowProfileMenu(false);
  };

  const isRecruiter = user?.user_type === "Entreprise" || user?.user_type === "Recruteur";
  const baseUrl = isRecruiter ? '/dashboardAdmin' : '/interfaceuser';

  return (
    <div className="relative">
      <div className="relative min-h-[480px] bg-gradient-to-r from-blue-600/90 to-blue-800/90">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10">
          <nav className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2">
                  <Link to={user ? baseUrl : '/'}>
                    <img src="src/assets/img/export.png" className="w-8 h-8" alt="Logo" />
                  </Link>
                  <span className="text-white text-xl font-bold">JobFindr</span>
                </div>

                <div className="hidden md:block">
                  <div className="flex items-center space-x-8">
                    {!user && (
                      <Link to="/jobs" className="text-white hover:text-blue-200 transition">
                        Trouver un job
                      </Link>
                    )}
                    
                    {user && isRecruiter ? (
                      <>
                        <Link to="/dashboardAdmin/offresemplois" className="text-white hover:text-blue-200 transition">
                          Mes offres
                        </Link>
                        <Link to="/dashboardAdmin" className="text-white hover:text-blue-200 transition">
                          Mon Dashboard
                        </Link>
                      </>
                    ) : user && (
                      <>
                        <Link to="/interfaceuser/offers" className="text-white hover:text-blue-200 transition">
                          Offres Postuler
                        </Link>
                        <Link to="/interfaceuser" className="text-white hover:text-blue-200 transition">
                          Tableau de bord
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {!user ? (
                    <>
                      <Link to="/login">
                        <button className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition">
                          Connexion
                        </button>
                      </Link>
                      <Link to="/register">
                        <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition">
                          Inscription 
                        </button>
                      </Link>
                    </>
                  ) : (
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center space-x-2 text-white hover:bg-white/10 px-3 py-2 rounded-lg"
                      >
                        <UserCircle className="w-6 h-6" />
                        {
                          user.user_type === "Candidat" && (
                            <span>{`${user.prenom} ${user.nom}`}</span>
                          )
                        }
                        
                      </button>
                      
                      {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.user_type}</p>
                          </div>
                          {
                            !isRecruiter && (
                              <button 
                                onClick={() => handleMenuItemClick(isRecruiter ? `${baseUrl}` : '/interfaceuser/profile')}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                Mon profil
                              </button>
                            )
                          }
                         
                          {isRecruiter && (
                            <button 
                              onClick={() => handleMenuItemClick('/dashboardAdmin/candidatures')}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100">
                              Gestion des candidatures
                            </button>
                          )}
                          <button 
                            onClick={() => handleMenuItemClick(isRecruiter ? '/dashboardAdmin/parametre' : '/interfaceuser/profile')}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100">
                            Paramètres
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>

        
          <div className="relative  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              Trouvez le job de vos rêves
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="search"
                      placeholder="Poste ou mot-clé"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="search"
                        placeholder="Localisation"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Rechercher
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default Header;