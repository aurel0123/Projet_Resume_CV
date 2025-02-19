import re
from django.core.exceptions import ValidationError
from .models import CV, MotCle, Candidature

""" class CVSearchService:
    

    def __init__(self):
        # Bonus pour le niveau d’études
        self.niveau_bonus = {
            "Bac": 0.0,
            "Bac+2": 0.05,
            "Bac+3": 0.1,
            "Bac+5": 0.15,
            "Master": 0.15,
            "Doctorat": 0.2
        }

        # Liste de compétences connues
        self.competences_connues = [
            "Python", "Django", "Java", "JavaScript", "React", "Angular", "SQL", "PostgreSQL",
            "Machine Learning", "Deep Learning", "Docker", "Kubernetes", "Linux", "Scrum", "DevOps"
        ]

        # Liste de certifications connues
        self.certifications_connues = [
            "AWS Certified", "Azure Fundamentals", "Google Cloud Certified", "Scrum Master", 
            "PMP", "Cisco CCNA", "TOGAF", "ITIL", "Oracle Certified", "Microsoft Certified",
            "Data Science Certification", "TensorFlow Developer", "Linux Professional Institute"
        ]

    def extract_niveau_etudes(self, text):
        #Extrait le niveau d'études à partir du texte du CV.
        niveaux_re = {
            "Bac": r"\b(Bac|Baccalauréat)\b",
            "Bac+2": r"\b(Bac\s?\+2|DUT|BTS)\b",
            "Bac+3": r"\b(Bac\s?\+3|Licence)\b",
            "Bac+5": r"\b(Bac\s?\+5|Master|M1|M2|MBA)\b",
            "Doctorat": r"\b(Doctorat|PhD)\b"
        }
        
        for niveau, regex in niveaux_re.items():
            if re.search(regex, text, re.IGNORECASE):
                return niveau
        
        return "Bac"  # Niveau par défaut si rien n'est détecté

    def extract_competences(self, text):
        #Extrait les compétences d'un CV.
        return [comp for comp in self.competences_connues if re.search(rf"\b{comp}\b", text, re.IGNORECASE)]

    def extract_certifications(self, text):
        #Extrait les certifications mentionnées dans le CV.
        return [cert for cert in self.certifications_connues if re.search(rf"\b{cert}\b", text, re.IGNORECASE)]

    def calculate_keyword_score(self, cv_text, keywords):
        #Calcule le score basé sur la présence des mots-clés.
        keyword_list = keywords.split(",")  # Supposons que les mots-clés sont séparés par des virgules
        keyword_matches = sum(1 for keyword in keyword_list if re.search(rf"\b{keyword.strip()}\b", cv_text, re.IGNORECASE))
        return keyword_matches * 0.1  # Chaque mot-clé trouvé ajoute +0.1 au score

    def search_cvs(self, offre, mots_cles, utilisateur):
        #Trie les CVs en fonction des critères définis.

        if utilisateur.user_type not in ["Recruteur", "Entreprise"]:
            raise ValidationError("Seuls les recruteurs et entreprises peuvent rechercher des CVs.")

        MotCle.objects.create(utilisateur=utilisateur, offre=offre, mots_cles=mots_cles)

        candidatures = Candidature.objects.filter(offre=offre, statut="En attente").select_related("cv")

        scored_cvs = []
        for candidature in candidatures:
            if candidature.cv:
                text_cv = candidature.cv.extracted_text.lower()

                # Calcul du score basé sur les mots-clés
                score_keywords = self.calculate_keyword_score(text_cv, mots_cles)

                # Extraire le niveau d’études et ajouter un bonus
                niveau_etudes = self.extract_niveau_etudes(text_cv)
                bonus_niveau = self.niveau_bonus.get(niveau_etudes, 0)

                # Extraire les compétences et ajouter un bonus
                competences_trouvees = self.extract_competences(text_cv)
                bonus_competences = len(competences_trouvees) * 0.05

                # Extraire les certifications et ajouter un bonus
                certifications_trouvees = self.extract_certifications(text_cv)
                bonus_certifications = len(certifications_trouvees) * 0.1

                # Calcul du score final
                score_final = score_keywords + bonus_niveau + bonus_competences + bonus_certifications

                candidature.cv.score = score_final
                candidature.cv.save()
                scored_cvs.append((candidature, score_final, niveau_etudes, competences_trouvees, certifications_trouvees))

        # Trier les candidatures par score final
        scored_cvs.sort(key=lambda x: x[1], reverse=True)

        # Sélectionner les top candidatures
        top_candidatures = scored_cvs[:5] if len(scored_cvs) > 5 else scored_cvs

        # Mettre à jour les statuts
        for i, (candidature, score_final, niveau_etudes, competences, certifications) in enumerate(scored_cvs):
            if (candidature, score_final, niveau_etudes, competences, certifications) in top_candidatures:
                candidature.statut = "Acceptée"
            else:
                candidature.statut = "Refusée"
            candidature.save()

        return [c[0].cv for c in top_candidatures]
 """



class CandidatureSearchService:
    """Service pour la recherche et le classement des candidatures en fonction des critères de l'offre."""

    def __init__(self):
        self.niveau_bonus = {
            "Bac": 0.0,
            "Bac+2": 0.05,
            "Bac+3": 0.1,
            "Bac+5": 0.15,
            "Master": 0.15,
            "Doctorat": 0.2
        }

        self.competences_connues = [
            "Python", "Django", "Java", "JavaScript", "React", "Angular", "SQL", "PostgreSQL",
            "Machine Learning", "Deep Learning", "Docker", "Kubernetes", "Linux", "Scrum", "DevOps"
        ]

        self.certifications_connues = [
            "AWS Certified", "Azure Fundamentals", "Google Cloud Certified", "Scrum Master", 
            "PMP", "Cisco CCNA", "TOGAF", "ITIL", "Oracle Certified", "Microsoft Certified",
            "Data Science Certification", "TensorFlow Developer", "Linux Professional Institute"
        ]

    def extract_niveau_etudes(self, text):
        """Extrait le niveau d'études depuis le texte de la candidature."""
        niveaux_re = {
            "Bac": r"\b(Bac|Baccalauréat)\b",
            "Bac+2": r"\b(Bac\s?\+2|DUT|BTS)\b",
            "Bac+3": r"\b(Bac\s?\+3|Licence)\b",
            "Bac+5": r"\b(Bac\s?\+5|Master|M1|M2|MBA)\b",
            "Doctorat": r"\b(Doctorat|PhD)\b"
        }
        
        for niveau, regex in niveaux_re.items():
            if re.search(regex, text, re.IGNORECASE):
                return niveau
        return "Bac"

    def extract_competences(self, text):
        """Extrait les compétences depuis le texte de la candidature."""
        return [comp for comp in self.competences_connues 
                if re.search(rf"\b{comp}\b", text, re.IGNORECASE)]

    def extract_certifications(self, text):
        """Extrait les certifications depuis le texte de la candidature."""
        return [cert for cert in self.certifications_connues 
                if re.search(rf"\b{cert}\b", text, re.IGNORECASE)]

    def calculate_keyword_score(self, text, keywords):
        """Calcule le score basé sur la présence des mots-clés."""
        keyword_list = keywords.split(",")
        matches = sum(1 for keyword in keyword_list 
                if re.search(rf"\b{keyword.strip()}\b", text, re.IGNORECASE))
        return matches * 0.1

    def search_candidatures(self, offre, mots_cles, utilisateur):
        """Recherche et classe les candidatures pour une offre donnée."""
        
        # Vérification des permissions
        if utilisateur.user_type not in ["Recruteur", "Entreprise"]:
            raise ValidationError("Seuls les recruteurs et entreprises peuvent rechercher des candidatures.")

        # Enregistrement des mots-clés utilisés
        MotCle.objects.create(utilisateur=utilisateur, offre=offre, mots_cles=mots_cles)

        # Récupération des candidatures en attente pour l'offre
        candidatures = Candidature.objects.filter(
            offre=offre, 
            statut="En attente"
        ).select_related('cv')

        scored_candidatures = []
        
        for candidature in candidatures:
            if not candidature.cv:
                continue
                
            cv_text = candidature.cv.extracted_text.lower()
            
            # Calcul des différents scores
            score_keywords = self.calculate_keyword_score(cv_text, mots_cles)
            niveau_etudes = self.extract_niveau_etudes(cv_text)
            bonus_niveau = self.niveau_bonus.get(niveau_etudes, 0)
            
            competences = self.extract_competences(cv_text)
            bonus_competences = len(competences) * 0.05
            
            certifications = self.extract_certifications(cv_text)
            bonus_certifications = len(certifications) * 0.1
            
            # Score final
            score_final = score_keywords + bonus_niveau + bonus_competences + bonus_certifications
            
            # Mise à jour du score dans le CV
            candidature.cv.score = score_final
            candidature.cv.save()
            
            scored_candidatures.append({
                'candidature': candidature,
                'score': score_final,
                'niveau': niveau_etudes,
                'competences': competences,
                'certifications': certifications
            })

        # Tri des candidatures par score
        scored_candidatures.sort(key=lambda x: x['score'], reverse=True)
        
        # Sélection des meilleures candidatures
        top_candidatures = scored_candidatures[:5]
        
        # Mise à jour des statuts
        """ for candidature_data in scored_candidatures:
            candidature = candidature_data['candidature']
            candidature.statut = "Entretien planifié" if candidature_data in top_candidatures else "Refusée"
            candidature.save() """
        # Mise à jour des statuts
        #Sélectionner les 50 meilleures candidatures
        top_candidatures = scored_candidatures[:50]
        for i, candidature_data in enumerate(scored_candidatures):
            candidature = candidature_data['candidature']
            
            if i < 50:
                candidature.statut = "Entretien planifié"  # Top 50 -> Entretien planifié
            else:
                candidature.statut = "Refusée"  # Les autres -> Refusées
            
            candidature.save()

        return [data['candidature'] for data in top_candidatures]