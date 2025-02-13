import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHippo, faBuilding, faUsers, faMagnifyingGlass, faFile, faList, faBriefcase } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <div>
      <div className='sidebar'>
        <div className="sidebar-brand">
          <h1>
            <span><FontAwesomeIcon icon={faHippo} /> </span>
            JobFindr
          </h1>
        </div>
        <div className="sidebar-menu">
          <ul>
            <li className='item'>
              <a href="" className='active'>
                <span><FontAwesomeIcon icon={faBuilding} /></span>
                <span>Dashbord</span>
              </a>
            </li>
            <li className='item'>
              <a href="" className='menu-btn'>
                <span><FontAwesomeIcon icon={faUsers} /></span>
                <span>Utilisateurs</span>
              </a>
            </li>
            <li className='item'>
              <a href="" className='menu-btn'>
                <span><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
                <span>Offres d’emploi</span>
              </a>
            </li>
            <li className='item'>
              <a href="" className='menu-btn'>
                <span><FontAwesomeIcon icon={faFile} /></span>
                <span>CV</span>
              </a>
            </li>
            <li className='item'>
              <a href="" className='menu-btn'>
                <span><FontAwesomeIcon icon={faList} /></span>
                <span>Candidatures </span>
              </a>
            </li>
            <li className='item'>
              <a href="" className='menu-btn'>
                <span><FontAwesomeIcon icon={faBriefcase} /></span>
                <span>Entreprises</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;