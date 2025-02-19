import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';


function Card({ data }) {
    const navigate = useNavigate()
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(60 + Math.random() * 20);
    const lightness = Math.floor(45 + Math.random() * 15);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Correction 1: Ajouter data comme dépendance et retourner directement le résultat
  const offresWithColor = useMemo(() => {
    return data.map((offre) => ({
      ...offre,
      background: generateRandomColor()
    }));
  }, [data]); // Ajout de data comme dépendance

  // Correction 2: Modification de la fonction handleVoir pour éviter l'exécution immédiate
  const handleVoir = (id) => () => {
    navigate(`candidatureListes/${id}`); // 🔥 Redirige vers la page des candidatures
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:gap-4 gap-3 p-4">
      {offresWithColor.map((offre) => (
        <div key={offre.id} className="border rounded-lg p-4 bg-white hover:shadow-xl transition-shadow">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
              style={{ background: offre.background }}
            >
              {offre.logo}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-lg text-gray-900">
                {offre.entreprise?.name || 'Entreprise inconnue'}
              </h3>
              <div className="text-gray-600 mt-1">
                {offre.titre}
              </div>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {offre.description}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-500 text-sm">
                  {offre.nbCandidatures} {offre.nbCandidatures > 1 ? 'Candidatures' : 'Candidature'}
                </span>
                <button
                  className="btn hover:bg-[#3663EB] hover:text-white"
                  onClick={handleVoir(offre.id)}
                >
                 Voir les candidatures
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;