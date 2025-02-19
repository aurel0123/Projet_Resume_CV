import React, { useState, useEffect } from 'react';
import { BookmarkPlus, BookmarkCheck, Filter } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Content = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    jobTypes: [],
    tags: [],
    salaryRange: { min: 0, max: Infinity }
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;
  const isCandidate = user.user_type !== 'Entreprise' && user.user_type !== 'Recruteur';

  // Reste des fonctions utilitaires
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(60 + Math.random() * 20);
    const lightness = Math.floor(45 + Math.random() * 15);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getInitials = (str) => {
    if (!str) return "";
    const words = str.trim().split(/\s+/);
    return words.length < 2 
      ? words[0][0].toUpperCase() 
      : words.slice(0, 2).map(word => word[0].toUpperCase()).join("");
  };

  // Effets et fonctions de données
  useEffect(() => {
    fetchJobs();
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/offres/');
      const offreWithLogo = response.data.map((offres) => ({
        ...offres,
        logo: getInitials(offres?.entreprise ? offres.entreprise.name : offres?.recruteur.company),
        background: generateRandomColor()
      }));
      setJobs(offreWithLogo);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setErrorMessage('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des filtres
  const uniqueJobTypes = [...new Set(jobs.map(job => job.type_emploi))];
  const uniqueTags = [...new Set(jobs.flatMap(job => 
    job.tag.split(',').map(t => t.trim()).filter(t => t)
  ))];
  const maxSalary = Math.max(...jobs.map(job => Number(job.salaire) || 0));

  // Autres fonctions de gestion restent identiques
  const handleApply = async (e) => {
    // ... reste du code handleApply
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedFile(null);
    setErrorMessage('');
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const getFilteredJobs = () => {
    return jobs.filter(job => {
      const matchesType = filters.jobTypes.length === 0 || filters.jobTypes.includes(job.type_emploi);
      const jobTags = job.tag.split(',').map(t => t.trim());
      const matchesTags = filters.tags.length === 0 || filters.tags.some(tag => jobTags.includes(tag));
      const matchesSalary = job.salaire >= filters.salaryRange.min && job.salaire <= filters.salaryRange.max;
      return matchesType && matchesTags && matchesSalary;
    });
  };

  // Composant de filtres
  const FiltersSection = () => (
    <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6 bg-base-100 p-4 md:p-0`}>
      <div>
        <h2 className="text-lg font-bold mb-4">Filtres</h2>
        
        <div className="mb-6">
          <h4 className="text-sm font-bold mb-2">Types d'Emplois</h4>
          <div className="space-y-2">
            {uniqueJobTypes.map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-secondary checkbox-sm"
                  checked={filters.jobTypes.includes(type)}
                  onChange={(e) => {
                    setFilters(prev => ({
                      ...prev,
                      jobTypes: e.target.checked
                        ? [...prev.jobTypes, type]
                        : prev.jobTypes.filter(t => t !== type)
                    }));
                  }}
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-bold mb-2">Mots clés</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueTags.map((tag) => (
              <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-secondary checkbox-sm"
                  checked={filters.tags.includes(tag)}
                  onChange={(e) => {
                    setFilters(prev => ({
                      ...prev,
                      tags: e.target.checked
                        ? [...prev.tags, tag]
                        : prev.tags.filter(t => t !== tag)
                    }));
                  }}
                />
                <span className="text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-2">Salaire</h4>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max={maxSalary}
              value={filters.salaryRange.max === Infinity ? maxSalary : filters.salaryRange.max}
              className="range range-primary range-xs"
              onChange={(e) => {
                setFilters(prev => ({
                  ...prev,
                  salaryRange: {
                    ...prev.salaryRange,
                    max: Number(e.target.value)
                  }
                }));
              }}
            />
            <div className="text-sm">
              Jusqu'à {filters.salaryRange.max === Infinity ? maxSalary : filters.salaryRange.max.toLocaleString()}CFA
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* Bouton Filtres Mobile */}
      <div className="md:hidden mb-4">
        <button 
          className="btn btn-outline w-full flex justify-between items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <span>Filtres</span>
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Section Filtres */}
        <FiltersSection />

        {/* Section Jobs */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {getFilteredJobs().map((job) => (
                <div key={job.id} className="card bg-base-100 hover:shadow-xl border">
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 items-start">
                        <div className="w-12 h-12 rounded-sm p-4 flex justify-center items-center text-white shrink-0" style={{background: job.background}}>
                          {job.logo}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="card-title text-base">{job.titre}</h3>
                          <span className="text-sm">{job.entreprise?.name || job.recruteur?.company}</span>
                        </div>
                      </div>
                      {isLoggedIn && isCandidate && (
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id);
                          }}
                        >
                          {savedJobs.includes(job.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-primary" />
                          ) : (
                            <BookmarkPlus className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <p className="text-sm">
                      Type d'emploi : <span className="font-semibold">{job.type_emploi}</span>
                    </p>
                    
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      {!job.hideSalary && (
                        <p className="text-sm text-base-content/70">
                          Salaire: <span className="font-semibold text-xs">
                            {Number(job.salaire).toLocaleString()}CFA
                            {job.negociable && ' (Négociable)'}
                          </span>
                        </p>
                      )}
                      <p className="text-xs">
                        <span className="text-sm">Publié le : </span>
                        <span className="font-semibold text-xs">
                          {new Date(job.date_publication).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    
                    <div className="card-actions justify-end mt-4 flex-wrap gap-2">
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/offres/${job.id}`)}
                      >
                        En savoir plus
                      </button>
                      {isLoggedIn && isCandidate && (
                        <button 
                          className="btn hover:bg-[#3663EB] bg-[#3663EB] hover:text-white text-white btn-sm"
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setShowDialog(true);
                          }}
                        >
                          Postuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de candidature */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal modal-open">
            <div className="modal-box max-w-md w-full">
              <h3 className="font-bold text-lg">Postuler à l'offre</h3>
              {errorMessage && (
                <div className="alert alert-error mt-4">
                  <span>{errorMessage}</span>
                </div>
              )}
              <form onSubmit={handleApply} className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Votre CV (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="file-input file-input-bordered w-full text-sm"
                    required
                  />
                </div>
                <div className="modal-action flex-wrap gap-2">
                  <button 
                    type="button" 
                    className="btn btn-sm" 
                    onClick={closeDialog}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-sm hover:bg-[#3663EB] bg-[#3663EB] text-white" 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer ma candidature'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Message de succès */}
      {showSuccess && (
        <div className="toast toast-start z-50">
          <div className="alert alert-success text-white">
            <span>Félicitations ! Votre candidature a été envoyée avec succès.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;