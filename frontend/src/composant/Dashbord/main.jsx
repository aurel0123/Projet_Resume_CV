import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFile, faList, faBriefcase, faArrowRight} from "@fortawesome/free-solid-svg-icons";

const Main = () => {
  return (
    <main>

        <div className="cards">
            <div className='card-single'>
                <div>
                    <h1>54</h1>
                    <span>Entreprises</span>
                </div>
                <div>
                    <span><FontAwesomeIcon icon={faBriefcase} /></span>
                </div>
            </div>
            
            <div className='card-single'>
                <div>
                    <h1>79</h1>
                    <span>Offres publiées</span>
                </div>
                <div>
                     <span><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
                </div>
            </div>

            <div className='card-single'>
                <div>
                    <h1>79</h1>
                    <span>Candidatures recues</span>
                </div>
                <div>
                    <span><FontAwesomeIcon icon={faList} /></span>
                </div>
            </div>

            <div className='card-single'>
                <div>
                    <h1>79</h1>
                    <span>CV</span>
                </div>
                <div>
                    <span><FontAwesomeIcon icon={faFile} /></span>
                </div>
            </div>

        </div>

        {/* <div className="recent-grid">
            <div className="cv">
                <div className="card">
                    <div className="card-header">
                        <h3>CV recents</h3>

                        <button>
                            Voir tout 
                            <span><FontAwesomeIcon icon={faArrowRight} /> </span> 
                        </button>
                    </div>
                    
                    <div className="card-body">
                        <table width={'100%'}>
                            <thead>
                                <td>CV </td>
                                <td>Entreprises </td>
                                <td>statut</td>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>CV1</td>
                                    <td>Inovact Sarl</td>
                                    <td>
                                        <span className='statuts'></span>
                                        accepter 
                                    </td>
                                </tr>

                                <tr>
                                    <td>CV2</td>
                                    <td>Kawa Service</td>
                                    <td>
                                        <span className='statuts'></span>
                                        En cours
                                    </td>
                                </tr>

                                <tr>
                                    <td>CV3</td>
                                    <td>Eps</td>
                                    <td>
                                        <span className='statuts'></span>
                                        Refuser
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div> */}

    </main>
  )
}

export default Main