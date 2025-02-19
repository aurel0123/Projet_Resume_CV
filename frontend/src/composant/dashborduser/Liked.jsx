import React, { useState, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import { BookmarkCheck } from 'lucide-react';

const breadcrumbItems = [
  { text: 'Offres sauvegardées' }
];

function Liked() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        // Récupérer les IDs des offres sauvegardées
        const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        
        // Récupérer toutes les offres
        const response = await fetch('http://127.0.0.1:8000/api/offres/');
        const allJobs = await response.json();
        
        // Filtrer pour ne garder que les offres sauvegardées
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
                  <button className="btn btn-outline">En savoir plus</button>
                  <button className="btn btn-primary">Postuler</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Liked;