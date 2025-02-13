""" import spacy
import re
from django.core.exceptions import ValidationError
from .models import CV, MotCle, OffreEmploi

class CVSearchService:

    def __init__(self):
        self.nlp = spacy.load('fr_core_news_md')

        # Bonus pour le niveau d’études
        self.niveau_bonus = {
            "Bac": 0.0,
            "Bac+2": 0.05,
            "Bac+3": 0.1,
            "Bac+5": 0.15,
            "Master": 0.15,
            "Doctorat": 0.2
        }

    def extract_niveau_etudes(self, text):
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
        competences_connues = [
            "Python", "Django", "Java", "JavaScript", "React", "Angular", "SQL", "PostgreSQL",
            "Machine Learning", "Deep Learning", "Docker", "Kubernetes", "Linux", "Scrum", "DevOps"
        ]

        competences_trouvees = [comp for comp in competences_connues if re.search(rf"\b{comp}\b", text, re.IGNORECASE)]
        
        return competences_trouvees

    def extract_certifications(self, text):
        certifications_connues = [
            "AWS Certified", "Azure Fundamentals", "Google Cloud Certified", "Scrum Master", 
            "PMP", "Cisco CCNA", "TOGAF", "ITIL", "Oracle Certified", "Microsoft Certified",
            "Data Science Certification", "TensorFlow Developer", "Linux Professional Institute"
        ]

        certifications_trouvees = [cert for cert in certifications_connues if re.search(rf"\b{cert}\b", text, re.IGNORECASE)]
        
        return certifications_trouvees

    def calculate_similarity_score(self, cv_text, keywords):
        cv_doc = self.nlp(cv_text.lower())
        keywords_doc = self.nlp(keywords.lower())
        return float(cv_doc.similarity(keywords_doc))

    def search_cvs(self, offre, mots_cles, utilisateur):

        if utilisateur.user_type not in ["Recruteur", "Entreprise"]:
            raise ValidationError("Seuls les recruteurs et entreprises peuvent rechercher des CVs.")

        MotCle.objects.create(utilisateur=utilisateur, offre=offre, mots_cles=mots_cles)

        candidatures = Candidature.objects.filter(offre=offre, statut="En attente").select_related("cv")

        scored_cvs = []
        for candidature in candidatures:
            if candidature.cv:
                score = self.calculate_similarity_score(candidature.cv.extracted_text, mots_cles)
                
                # Extraire le niveau d’études du texte du CV
                niveau_etudes = self.extract_niveau_etudes(candidature.cv.extracted_text)
                bonus_niveau = self.niveau_bonus.get(niveau_etudes, 0)

                # Extraire les compétences du texte du CV
                competences_trouvees = self.extract_competences(candidature.cv.extracted_text)
                bonus_competences = len(competences_trouvees) * 0.05  # +0.05 par compétence trouvée

                # Extraire les certifications du texte du CV
                certifications_trouvees = self.extract_certifications(candidature.cv.extracted_text)
                bonus_certifications = len(certifications_trouvees) * 0.1  # +0.1 par certification trouvée

                # Score final
                score_final = score + bonus_niveau + bonus_competences + bonus_certifications

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

        return [c[0].cv for c in top_candidatures] """