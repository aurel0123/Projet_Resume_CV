import React, { useState, useEffect } from 'react';
import { Building2, Calendar, Clock } from 'lucide-react';
import Breadcrumb from './Breadcrumb';
import axios from 'axios';

const MesJobs = () => {
  const [mesCandidatures, setMesCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('access');

        if (!userInfo || !token) {
          throw new Error('Informations d\'authentification manquantes');
        }

        const response = await axios.get('http://127.0.0.1:8000/api/candidatures/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // On récupère les détails des offres pour chaque candidature
        const candidaturesWithDetails = await Promise.all(
          response.data.map(async (candidature) => {
            const offreResponse = await axios.get(`http://127.0.0.1:8000/api/offres/${candidature.offre}/`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            return {
              ...candidature,
              offre_details: offreResponse.data
            };
          })
        );
        console.log(candidaturesWithDetails)
        setMesCandidatures(candidaturesWithDetails);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, []);

  const breadcrumbItems = [
    { text: "Mes candidatures" }
  ];

  const getStatusBadgeClass = (statut) => {
    switch (statut) {
      case 'En attente':
        return ' badge-warning p-2 text-center ';
      case 'Entretien planifié':
        return ' badge-success p-2 text-center ';
      case 'Refusée':
        return 'badge-error p-2 text-center ';
      default:
        return 'badge';
    }
  };
  


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Erreur: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="border card bg-base-100">
            <div className="card-body">
              <h2 className="card-title ">Mes Candidatures</h2>
              {mesCandidatures.length === 0 ? (
                
                <div className="alert alert-info">
                  <span>Vous n'avez pas encore postulé à des offres.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {mesCandidatures.map((candidature) => {
                    const Entreprise = candidature.offre_details.entreprise ? candidature.offre_details.entreprise .name : candidature.offre_details.recruteur.company
                    console.log(Entreprise)
                    return(
                      <div key={candidature.id} className="transition-shadow border card bg-base-100 hover:shadow-md">
                      <div className="card-body">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{candidature.offre_details?.titre || 'Titre non disponible'}</h3>
                            <div className="flex items-center mt-1 space-x-2 text-gray-600">
                              <Building2 className="w-4 h-4" />
                              <span>
                                {Entreprise}
                              </span>
                            </div>
                          </div>
                          <span className={getStatusBadgeClass(candidature.statut)}>
                            {candidature.statut}
                          </span>
                        </div>
                        
                        <p className="mt-2 text-gray-600 line-clamp-2">{candidature.offre_details?.description || 'Description non disponible'}</p>
                        
                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Postulé le {new Date(candidature.date_candidature).toLocaleDateString()}</span>
                          </div>
                          {candidature.cv_url && (
                            <a 
                              href={`http://127.0.0.1:8000${candidature.cv_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline"
                            >
                              Voir mon CV
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="border card bg-base-100">
            <div className="card-body">
              <h2 className="card-title">Résumé des candidatures</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total des candidatures</span>
                  <span className="badge">{mesCandidatures.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>En attente</span>
                  <div className="flex items-center justify-center w-6 h-6 border rounded-full badge-warning">
                    <span className="text-white">
                      {mesCandidatures.filter(c => c.statut === 'En attente').length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Entretien planifié</span>
                  <div className="flex items-center justify-center w-6 h-6 border rounded-full badge-success"> 
                    <span className="text-white">
                      {mesCandidatures.filter(c => c.statut === 'Entretien planifié').length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Refusées</span>
                  <div className='flex items-center justify-center w-6 h-6 border rounded-full badge-error'>
                    <span className="text-white">
                      {mesCandidatures.filter(c => c.statut === 'Refusée').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesJobs;