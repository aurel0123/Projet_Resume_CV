import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Briefcase,
  Building,
  GraduationCap,
  Languages,
  Share2,
  Upload
} from 'lucide-react';
import axios from 'axios';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const token = localStorage.getItem('access');
  
  const userData = localStorage.getItem('user');
  const convertData = JSON.parse(userData);
  const isCandidat = convertData?.user_type === "Candidat";

  const getInitials = (str) => {
    if (!str) return "";
    const words = str.trim().split(/\s+/);
    return words.length < 2 
      ? words[0][0].toUpperCase() 
      : words.slice(0, 2).map(word => word[0].toUpperCase()).join("");
  };

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(60 + Math.random() * 20);
    const lightness = Math.floor(45 + Math.random() * 15);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadError('');
    } else {
      setUploadError('Veuillez sélectionner un fichier PDF');
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError('Veuillez sélectionner un CV');
      return;
    }

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('candidat', convertData.id);
    formData.append('fichier', selectedFile);
    formData.append('offre_id', id);

    try {
      await axios.post('http://127.0.0.1:8000/api/cvs/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        },
      });
      
      // Fermer la modal
      const modalCheckbox = document.getElementById('apply_modal');
      if (modalCheckbox) {
        modalCheckbox.checked = false;
      }
      
      // Afficher une notification de succès
      const successAlert = document.createElement('div');
      successAlert.className = 'alert alert-success fixed top-4 right-4 w-96 z-50';
      successAlert.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Votre candidature a été envoyée avec succès!</span>
      `;
      document.body.appendChild(successAlert);
      
      // Supprimer la notification après 3 secondes
      setTimeout(() => {
        successAlert.remove();
      }, 3000);
      
    } catch (error) {
      setUploadError('Une erreur est survenue lors de l\'envoi du CV');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/offres/${id}`);
        const jobData = {
          ...response.data,
          logo: getInitials(response.data?.entreprise ? response.data.entreprise.name : response.data?.recruteur.company),
          background: generateRandomColor()
        };
        setJob(jobData);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Impossible de charger les détails de l\'offre');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen p-8">
        <div className="alert alert-error">
          <span>{error || 'Offre non trouvée'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-base-100 border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-ghost btn-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux offres
          </button>
          
          <div className="flex gap-6 items-start">
            <div 
              className="w-20 h-20 rounded-lg flex justify-center items-center text-white text-xl"
              style={{ background: job.background }}
            >
              {job.logo}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{job.titre}</h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {job.entreprise?.name || job.recruteur?.company}
                  </p>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.localisation}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.type_emploi}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Publié le {new Date(job.date_publication).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-base-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Description du poste</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Compétences requises</h2>
            <div className="flex flex-wrap gap-2">
              {job.tag && job.tag.split(',').map((tag, index) => (
                <span 
                  key={index}
                  className="badge badge-lg"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Apply Button */}
          {isCandidat && (
            <div className="bg-base-100 rounded-lg p-6">
              <label 
                htmlFor="apply_modal" 
                className="btn btn-primary w-full"
              >
                Postuler à cette offre
              </label>
            </div>
          )}

          {/* Job Details */}
          <div className="bg-base-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Informations complémentaires</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium">Salaire</h3>
                  <p className="text-gray-600">
                    {Number(job.salaire).toLocaleString()} CFA
                    {job.negociable && ' (Négociable)'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium">Type de contrat</h3>
                  <p className="text-gray-600">{job.type_emploi}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium">Niveau d'expérience</h3>
                  <p className="text-gray-600">{job.experience || 'Non spécifié'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Languages className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <h3 className="font-medium">Langues requises</h3>
                  <p className="text-gray-600">{job.langues || 'Non spécifié'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-base-100 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">À propos de l'entreprise</h2>
            <div className="prose">
              <p>{job.entreprise?.description || job.recruteur?.description || 'Aucune description disponible'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <input type="checkbox" id="apply_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Postuler à l'offre</h3>
          
          <div className="mb-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm font-medium">
                  {selectedFile ? selectedFile.name : "Sélectionner votre CV (PDF)"}
                </span>
              </label>
            </div>
            {uploadError && (
              <div className="alert alert-error mt-4">
                <span>{uploadError}</span>
              </div>
            )}
          </div>
          
          <div className="modal-action">
            <label htmlFor="apply_modal" className="btn">Annuler</label>
            <button 
              className={`btn btn-primary ${uploading ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={!selectedFile || uploading}
            >
              {uploading ? "Envoi en cours..." : "Envoyer"}
            </button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="apply_modal">Close</label>
      </div>
    </div>
  );
};

export default Details;