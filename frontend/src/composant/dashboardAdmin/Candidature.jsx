import { useEffect, useState } from "react";
import Breadcrumb from "../dashborduser/Breadcrumb";
import axios from 'axios';
import Card from "../Composantréutilisable/Card";

const getInitials = (str) => {
  if (!str) return "";
  const words = str.trim().split(/\s+/);
  return words.length < 2 
    ? words[0][0].toUpperCase() 
    : words.slice(0, 2).map(word => word[0].toUpperCase()).join("");
};

function Candidature() {
  const breadcrum = [{ text: "Candidatures" }];
  const [offres, setOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const token = localStorage.getItem('access');

  const fetchAllData = async () => {
    try {
      // Récupérer les offres
      const offresResponse = await axios.get('http://127.0.0.1:8000/api/offres-entreprise/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Récupérer toutes les candidatures
      const candidaturesResponse = await axios.get('http://127.0.0.1:8000/api/candidatures/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Compter les candidatures par offre
      const candidatureCounts = {};
      candidaturesResponse.data.forEach(candidature => {
        const offreId = candidature.offre;
        candidatureCounts[offreId] = (candidatureCounts[offreId] || 0) + 1;
      });

      // Associer le nombre de candidatures aux offres
      const offresWithLogo = offresResponse.data.map(offre => ({
        ...offre,
        logo: getInitials(offre.entreprise?.name || 'Unknown Company'),
        nbCandidatures: candidatureCounts[offre.id] || 0
      }));

      setOffres(offresWithLogo);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div>
      <Breadcrumb items={breadcrum} />
      
      {/* Liste des offres */}
      <Card 
        data={offres} 
        onSelect={(offre) => setSelectedOffre(offre)} 
      />
    </div>
  );
}

export default Candidature;
