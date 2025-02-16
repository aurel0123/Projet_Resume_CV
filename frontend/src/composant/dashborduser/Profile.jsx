import { useState, useEffect } from 'react';
import Breadcrumb from './Breadcrumb';
import picture from '../../assets/img/dafaut.webp';
import axios from 'axios';
import { Camera } from 'lucide-react';

const breadcrumbItems = [
  { text: 'Profile' }
];

function Profile() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    phone: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [notification, setNotification] = useState({
    type: '', // 'success' ou 'error'
    message: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });
      
      const { nom, prenom, phone, email } = response.data;
      console.log(response.data)
      setFormData(prevState => ({
        ...prevState,
        nom,
        prenom,
        phone,
        email
      }));
    } catch (error) {
      showNotification(error, 'Erreur lors du chargement du profil');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    // Réinitialiser la notification après 5 secondes
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 5000);
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.put('http://127.0.0.1:8000/api/profile/', {
        nom: formData.nom,
        prenom: formData.prenom,
        phone: formData.phone,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });
      
      showNotification('success', 'Profil mis à jour avec succès');
    } catch (error) {
      showNotification('error', error.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      showNotification('error', 'Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);
    try {
      await axios.put('http://127.0.0.1:8000/api/profile/password/', {
        current_password: formData.current_password,
        new_password: formData.new_password,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });
      
      showNotification('success', 'Mot de passe mis à jour avec succès');
      setFormData(prevState => ({
        ...prevState,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
    } catch (error) {
      showNotification('error', error.response?.data?.error || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    setLoading(true);
    try {
      await axios.put('/api/profile/image/', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showNotification('success', 'Photo de profil mise à jour');
      fetchProfileData();
    } catch (error) {
      showNotification(error, 'Erreur lors du changement de la photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Notifications */}
      {notification.message && (
        <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
          <span>{notification.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Profile Picture Card */}
        <div className="shadow-xl card bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Photo de profil</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={picture} alt="Profile" />
                </div>
              </div>
              <div className="text-sm text-base-content/70">
                JPG, GIF ou PNG. Max 800K
              </div>
              <div className="flex gap-2">
                <label className="btn btn-primary">
                  <Camera className="w-4 h-4 mr-2" />
                  Changer
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <button className="btn btn-outline">Supprimer</button>
              </div>
            </div>
          </div>
        </div>

        {/* General Information Card */}
        <div className="shadow-xl card bg-base-100">
          <form onSubmit={handleGeneralSubmit} className="card-body">
            <h2 className="card-title">Informations générales</h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nom</span>
                </label>
                <input 
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Prénom</span>
                </label>
                <input 
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="input input-bordered"
                  placeholder="Votre prénom"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="input input-bordered opacity-60"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Téléphone</span>
              </label>
              <input 
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Votre numéro de téléphone"
              />
            </div>

           

            <div className="justify-end mt-4 card-actions">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder les changements'}
              </button>
            </div>
          </form>
        </div>

        {/* Password Card */}
        <div className="shadow-xl card bg-base-100 md:col-span-2">
          <form onSubmit={handlePasswordSubmit} className="card-body">
            <h2 className="card-title">Modification du mot de passe</h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mot de passe actuel</span>
                </label>
                <input 
                  type="password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nouveau mot de passe</span>
                </label>
                <input 
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirmer le mot de passe</span>
                </label>
                <input 
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="justify-end mt-4 card-actions">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;