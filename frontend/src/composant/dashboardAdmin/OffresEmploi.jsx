import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EllipsisVertical } from 'lucide-react';
import Breadcrumb from "../dashborduser/Breadcrumb";

// Constantes
const API_BASE_URL = 'http://127.0.0.1:8000/api';
const TYPES_EMPLOI = ['CDI', 'CDD', 'Stage', 'Freelance', 'Temporaire'];

// État initial du formulaire
const initialFormState = {
  titre: '',
  description: '',
  type_emploi: '',
  salaire: '',
  negociable: false,
  hideSalary: false,
  tags: [],
  localisation: '',
  date_expiration: ''
};

const OffresEmploi = () => {
  // États
  const breadcrum = [{ text: "Création une offre" }];
  const [offres, setOffres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTag, setCurrentTag] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Fonctions utilitaires
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentStep(1);
    setCurrentTag('');
    setSelectedJob(null);
  };
  const handleDropdownToggle = (offreId) => {
    setActiveDropdown(prev => (prev === offreId ? null : offreId));
  };
  // Gestion des API
  const fetchOffres = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/offres-entreprise/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });
      setOffres(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  // Gestionnaires d'événements
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleEdit = (offre) => {
    setActiveDropdown(null);
    setSelectedJob(offre);
    setFormData({
      titre: offre.titre,
      description: offre.description,
      type_emploi: offre.type_emploi,
      salaire: offre.salaire,
      negociable: offre.negociable,
      hideSalary: offre.hideSalary,
      tags: offre.tag ? offre.tag.split(',').map(tag => tag.trim()) : [],
      localisation: offre.localisation,
      date_expiration: offre.date_expiration
    });
    setCurrentStep(1);
    setShowCreateModal(true);
  };

  const handleDelete = async (offreId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await axios.delete(`${API_BASE_URL}/offres/${offreId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        });
        setOffres(offres.filter(offre => offre.id !== offreId));
        setActiveDropdown(null);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        tag: formData.tags.join(',')
      };
      delete submitData.tags;

      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      };

      let response;
      if (selectedJob) {
        response = await axios.put(
          `${API_BASE_URL}/offres/${selectedJob.id}/`,
          submitData,
          { headers }
        );
        setOffres(offres.map(offre => 
          offre.id === selectedJob.id ? response.data : offre
        ));
      } else {
        response = await axios.post(
          `${API_BASE_URL}/offres/`,
          submitData,
          { headers }
        );
        setOffres([...offres, response.data]);
      }

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepChange = (direction) => {
    if (direction === 'next' && currentStep < 3) {
      setCurrentStep(curr => curr + 1);
    } else if (direction === 'prev' && currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  // Composants de formulaire
  const renderStep1 = () => (
    <div className="space-y-6">
      
      <h3 className="font-bold text-lg">Détails du poste</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Titre du poste</label>
        <input
          type="text"
          name="titre"
          value={formData.titre}
          onChange={handleInputChange}
          className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none block w-full p-2.5 rounded-l-lg py-3 px-4"
          placeholder="ex: Développeur Full Stack"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Type d'emploi</label>
        <div className="space-y-2">
          {TYPES_EMPLOI.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                name="type_emploi"
                value={type}
                checked={formData.type_emploi === type}
                onChange={handleInputChange}
                className="radio radio-primary mr-2"
                required
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description du poste</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 min-h-[200px] bg-gray-50 border border-gray-300 rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none"
          placeholder="Fournir une description détaillée du poste..."
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Compétences et Rémunération</h3>
  
      <div>
        <label className="block text-sm font-medium mb-2">Compétences requises</label>
        <div className="flex space-x-2 justify-between mb-2">
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            className="input input-bordered flex-1  bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none block w-full p-2.5 rounded-l-lg py-3 px-4"
            placeholder="Ajouter une compétence"
          />
          <button 
            type="button"
            onClick={handleAddTag}
            className="bg-[#3663EB] text-white p-3 rounded-md"
          >
            Ajouter
          </button>
        </div>
        <div className="flex flex-wrap gap-2 ">
          {formData.tags.map((tag, index) => (
            <span key={index} className="badge badge-outline gap-2 p-3">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
  
      <div className="space-y-4">
        <label className="block text-sm font-medium">Salaire</label>
        <input
          type="number"
          name="salaire"
          value={formData.salaire}
          onChange={handleInputChange}
          className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none block w-full p-2.5 rounded-l-lg py-3 px-4"
          placeholder="Entrez le salaire pour ce poste"
          required
        />
  
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="negociable"
              checked={formData.negociable}
              onChange={handleInputChange}
              className="checkbox"
            />
            <span>Négociable</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hideSalary"
              checked={formData.hideSalary}
              onChange={handleInputChange}
              className="checkbox"
            />
            <span>Masquer le salaire</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Localisation et Date</h3>

      <div>
        <label className="block text-sm font-medium mb-2">Localisation</label>
        <input
          type="text"
          name="localisation"
          value={formData.localisation}
          onChange={handleInputChange}
          className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none block w-full p-2.5 rounded-l-lg py-3 px-4"
          placeholder="Entrer l'adresse"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Date d'expiration</label>
        <input
          type="date"
          name="date_expiration"
          value={formData.date_expiration}
          onChange={handleInputChange}
          className="mb-2 bg-gray-50 text-gray-600 border border-gray-300 sm:text-sm rounded-lg focus:border-gray-300 focus:ring-0 focus:outline-none block w-full p-2.5 rounded-l-lg py-3 px-4"
          required
        />
      </div>
    </div>
  );

  const renderCreateJobStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // Rendu principal
  return (
    <div className="container mx-auto p-4">
      <Breadcrumb items={breadcrum} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offres d'emploi</h1>
        {user?.user_type === 'Entreprise' && (
          <button 
            className="hover:bg-[#3e5fc2] bg-[#3663EB] text-white p-3 rounded-md"
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
          >
            + Créer une offre
          </button>
        )}
      </div>

      {/* Liste des offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offres.map((offre) => (
          <div key={offre.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-lg font-semibold">{offre.titre}</h2>
                  <p className="text-sm text-gray-600">
                    {offre.entreprise?.name || offre.recruteur?.company}
                  </p>
                </div>
                <div className="relative">
                  <button 
                    className="btn btn-ghost btn-circle"
                    onClick={() => handleDropdownToggle(offre.id)}
                  >
                    <EllipsisVertical/>
                  </button>
                  {activeDropdown === offre.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                      <ul className="py-2">
                        <li>
                          <button 
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => handleEdit(offre)}
                          >
                            Modifier
                          </button>
                        </li>
                        <li>
                          <button 
                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                            onClick={() => handleDelete(offre.id)}
                            >
                              Supprimer
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
  
                <div className="mt-4 space-y-2">
                  <p className="text-sm">Localisation: {offre.localisation}</p>
                  <p className="text-sm">Salaire: {!offre.hideSalary && `${parseFloat(offre.salaire).toLocaleString('fr-FR')} CFA${offre.negociable ? ' (Négociable)' : ''}`}</p>
                  <p className="text-sm">Date de création: {formatDate(offre.date_publication)}</p>
                </div>
  
                <div className="flex gap-2 mt-4">
                  {offre.tag && (
                    <div className="flex flex-wrap gap-2">
                      {offre.tag.split(',').map((tag, index) => (
                        <span key={index} className="badge badge-outline">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
  
                <div className="card-actions justify-end mt-4">
                  <button 
                    className="btn btn-md btn-outline btn-primary"
                    onClick={() => {
                      setSelectedJob(offre);
                      setShowModal(true);
                    }}
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Modal de création/modification */}
        {showCreateModal && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="lg:text-2xl font-bold text-md">
                    {selectedJob ? 'Modifier l\'offre d\'emploi' : 'Créer une offre d\'emploi'}
                  </h2>
                  <button 
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step === currentStep ? 'bg-[#3663EB] text-white' : 'bg-gray-200'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className="w-12 h-1 bg-gray-200 mx-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
  
              <form onSubmit={handleSubmit}>
                {renderCreateJobStep()}
                
                <div className="modal-action mt-6">
                  {currentStep > 1 && (
                    <button 
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleStepChange('prev')}
                    >
                      Précédent
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button 
                      type="button"
                      className="p-3 rounded-md bg-[#3663EB] text-white"
                      onClick={() => handleStepChange('next')}
                    >
                      Suivant
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="p-3 rounded-md bg-[#3663EB] text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Publication en cours...' : 'Publier l\'offre'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
  
        {/* Modal de détails */}
        {showModal && selectedJob && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg">{selectedJob.titre}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedJob.entreprise?.name || selectedJob.recruteur?.company} • {selectedJob.localisation}
                  </p>
                </div>
                <button 
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="prose max-w-none">
                <h4 className="font-semibold">Description du poste</h4>
                <div className="whitespace-pre-wrap">{selectedJob.description}</div>
                
                <div className="mt-6">
                  <h4 className="font-semibold">Informations complémentaires</h4>
                  <ul className="list-disc pl-4">
                    <li>Type d'emploi: {selectedJob.type_emploi}</li>
                    <li>Salaire: {!selectedJob.hideSalary && `${parseFloat(selectedJob.salaire).toLocaleString('fr-FR')} CFA${selectedJob.negociable ? ' (Négociable)' : ''}`}</li>
                    <li>Date de publication: {formatDate(selectedJob.date_publication)}</li>
                    <li>Date d'expiration: {formatDate(selectedJob.date_expiration)}</li>
                  </ul>
                </div>
              </div>
  
              <div className="modal-action">
                <button 
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default OffresEmploi;