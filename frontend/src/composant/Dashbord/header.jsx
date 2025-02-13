import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


const Header = () => {
  return (
    <div className='main-content'>
      <header>
        <h1>
          <label htmlFor="">
            <span> <FontAwesomeIcon icon={faBars} /></span>
          </label>
          Dashbord
        </h1>

        <div className='search-wrapper'>
            <span><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
            <input type="search" placeholder="Rechercher ici" />
        </div>

        <div className='user-wrapper'>
            <img className='image' src="../../assets/img/user1.jpg" alt="" width="40" height="40" />
            <div>
                <h4>John Doe</h4>
                <small>Super admin</small>
            </div>
        </div>
      </header>
    </div>
  );
};

export default Header;