import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const CandidaturesList = () => {
  const { offreId } = useParams();
  const [candidatures, setCandidatures] = useState([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [motCle, setMotCle] = useState("");
  const [nombreCandidatures, setNombreCandidatures] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const token = localStorage.getItem('access');

  useEffect(() => {
    fetchCandidatures();
  }, [offreId]);

  const fetchCandidatures = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/candidatures/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const filtered = response.data.filter((cand) => cand.offre === parseInt(offreId));
      setCandidatures(filtered);
      setFilteredCandidatures(filtered);
      setIsFiltered(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des candidatures:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!motCle) {
      setFilteredCandidatures(candidatures);
      setIsFiltered(false);
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('mots_cles', motCle);
      formData.append('nombre_candidatures', nombreCandidatures.toString());

      const res = await axios.post(
        `http://127.0.0.1:8000/api/cvs/search/${offreId}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        const entretienCandidatures = res.data.candidatures.filter(
          candidature => candidature.statut === 'Entretien planifié'
        );
        setFilteredCandidatures(entretienCandidatures);
        setIsFiltered(true);
      }
    } catch (error) {
      console.error("Erreur lors du tri :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNombreCandidaturesChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setNombreCandidatures(10);
    } else {
      const numValue = parseInt(value);
      setNombreCandidatures(Math.max(1, Math.min(50, numValue)));
    }
  };

  const renderTableRows = () => {
    if (filteredCandidatures.length === 0) {
      return (
        <tr key="no-results">
          <td colSpan="5" className="text-center py-4 text-gray-500">
            Aucune candidature trouvée
          </td>
        </tr>
      );
    }

    return filteredCandidatures.map((candidature) => (
      <tr key={`candidature-${candidature.id}`}>
        <td className="font-medium">
          {candidature.candidat.nom} {candidature.candidat.prenom}
        </td>
        <td>{new Date(candidature.date_candidature).toLocaleDateString()}</td>
        <td>
          <div className={`badge p-4 text-white ${
            candidature.statut === 'Entretien planifié' ? 'badge-success' :
            candidature.statut === 'Refusée' ? 'badge-error' : 'badge-warning'
          }`}>
            {candidature.statut}
          </div>
        </td>
        <td className="text-center">
          {candidature.cv?.score ? (
            <span className="font-medium">
              {Number(candidature.cv?.score).toFixed(2)}
            </span>
          ) : '-'}
        </td>
        <td>
          {candidature.cv_url && (
            <a 
              href={`http://127.0.0.1:8000${candidature.cv_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline"
            >
              Voir le CV
            </a>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className='flex gap-4 items-center mb-4'>
          <div className='flex gap-4 items-center btn btn-ghost btn-circle'>
            <a href="http://localhost:5173/dashboardAdmin/candidatures/">
              <ArrowLeft/>
            </a>
          </div>
          <h2 className="card-title">
            {isFiltered ? "Candidatures - Entretiens Planifiés" : "Toutes les Candidatures"}
          </h2>
        </div>
        
        <div className="form-control w-full mb-4">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="Entrez des mots-clés pour filtrer les candidatures..."
              className="bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none block w-full p-2.5 rounded-l-lg py-3 px-4"
              value={motCle}
              onChange={(e) => setMotCle(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="50"
              className="bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none w-32 p-2.5"
              value={nombreCandidatures}
              onChange={handleNombreCandidaturesChange}
              placeholder="Nombre"
            />
            <button 
              className={`rounded-lg text-white bg-[#3663EB] p-4 ${loading ? 'opacity-50' : ''}`}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Filtrer'}
            </button>
            {isFiltered && (
              <button 
                className="rounded-lg text-white bg-gray-500 p-4"
                onClick={() => {
                  setFilteredCandidatures(candidatures);
                  setIsFiltered(false);
                  setMotCle("");
                  setNombreCandidatures(10);
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Candidat</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidaturesList;