from .models import *
from rest_framework import serializers


class MotCleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotCle
        fields = ['id', 'utilisateur', 'offre', 'mots_cles', 'created_at']


        
class RecruteurAddationalSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruteurAddational
        fields = ['company']

class EntrepriseAddationalSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntrepriseAddational
        fields = ['name', 'website', 'address']

class CustomUserSerializer(serializers.ModelSerializer):
    recruteur_info = RecruteurAddationalSerializer(source='recruteuraddational', read_only=True)
    entreprise_info = EntrepriseAddationalSerializer(source='entrepriseaddational', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'phone', 'user_type', 'password', 'recruteur_info', 'entreprise_info' , 'is_staff']

class OffreEmploiSerializer(serializers.ModelSerializer) : 
    class Meta : 
        model = OffreEmploi
        fields = '__all__'
        read_only_fields = ('date_publication', )

class CandidatureSerializer(serializers.ModelSerializer):
    cv_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Candidature
        fields = ['id', 'candidat', 'offre', 'cv', 'cv_url', 'lettre_motivation',
                'date_candidature', 'statut']
        read_only_fields = ['date_candidature']
    
    def get_cv_url(self, obj):
        if obj.cv:
            return obj.cv.fichier.url
        return None

class CVSerializer(serializers.ModelSerializer):
    class Meta:
        model = CV
        fields = '__all__'
        read_only_fields = ['extracted_text', 'date_telechargement', 'score']