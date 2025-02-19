import React, { useState, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import { BookmarkCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const breadcrumbItems = [
  { text: 'Offres sauvegardées' }
];

function Liked() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Récupérer les informations de l'utilisateur
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;
  const isCandidate = user.user_type === 'Candidat';

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        const response = await fetch('http://127.0.0.1:8000/api/offres/');
        const allJobs = await response.json();
        const savedJobsData = allJobs.filter(job => savedJobIds.includes(job.id));
        setJobs(savedJobsData);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const removeSavedJob = (jobId) => {
    const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const newSavedJobs = savedJobIds.filter(id => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn || !isCandidate) {
      setErrorMessage('Vous devez être connecté en tant que candidat pour postuler.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Veuillez sélectionner un CV');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('candidat', user.id);
    formData.append('fichier', selectedFile);
    formData.append('offre_id', selectedJobId);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/cvs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        }
      });

      if (response.status === 201 || response.status === 200) {
        setShowDialog(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrorMessage(
        error.response?.data?.message || 
        'Une erreur est survenue lors de l\'envoi de votre candidature'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedFile(null);
    setErrorMessage('');
  };

  return (
    <div className="p-4">
      <Breadcrumb items={breadcrumbItems} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">Aucune offre sauvegardée</h3>
          <p className="text-base-content/70">Les offres que vous sauvegardez apparaîtront ici</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {jobs.map((job) => (
            <div key={job.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h3 className="card-title">{job.titre}</h3>
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeSavedJob(job.id)}
                  >
                    <BookmarkCheck className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <p className="text-sm text-base-content/70">
                  {job.entreprise?.name || job.recruteur?.company}
                </p>
                <p className="text-sm text-base-content/70">{job.localisation}</p>
                <p className="text-sm text-base-content/70">{job.type_emploi}</p>
                {!job.hideSalary && (
                  <p className="text-sm text-base-content/70">
                    Salaire: {Number(job.salaire).toLocaleString()}€
                    {job.negociable && ' (Négociable)'}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.tag.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="badge badge-outline"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <div className="card-actions justify-end mt-4">
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

      {/* Boîte de dialogue pour la candidature */}
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
}

export default Liked;