from rest_framework import status, permissions , viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, RecruteurAddational, EntrepriseAddational , OffreEmploi , Candidature , CV
from .serializers import CustomUserSerializer , OffreEmploiSerializer ,CandidatureSerializer , CVSerializer , MotCleSerializer
from django.core.files.storage import default_storage
import pypdf
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
#from .services import CVSearchService

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        with transaction.atomic():
            user_data = {
                'email': request.data.get('email'),
                'password': request.data.get('password'),
                'user_type': request.data.get('userType'),
                'phone': request.data.get('phone'),
            }
            
            user = CustomUser.objects.create_user(**user_data)
            
        
            # Création des informations additionnelles selon le type d'utilisateur
            if user.user_type == 'Entreprise':
                EntrepriseAddational.objects.create(
                    user=user,
                    name=request.data.get('companyName'),
                    website=request.data.get('website'),
                    address=request.data.get('address')
                )
            elif user.user_type == 'Recruteur':
                RecruteurAddational.objects.create(
                    user=user,
                    company=request.data.get('company')
                )
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': CustomUserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': CustomUserSerializer(user).data
        })
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class IsRecruteurOrEntreprise (permissions.BasePermission) : 
    def has_permission(self , request , view) : 
        return request.user.user_type in ['CustomUser.Types.RECRUTEUR, CustomUser.Types.ENTREPRISE']

class OffreEmploiViewSet(viewsets.ModelViewSet):
    queryset = OffreEmploi.objects.all()
    serializer_class = OffreEmploiSerializer

    def get_permisson(self): 
        if self.action in ['create' , 'update' , 'partial_update', 'destroy'] : 
            permission_classes = [IsRecruteurOrEntreprise]
        else : 
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    def perform_create(self, serializer):
        user = self.request.user

        if user.user_type == CustomUser.Types.RECRUTEUR:
            try:
                recruteur_profile = RecruteurAddational.objects.get(user=user)
                serializer.save(recruteur=recruteur_profile)
            except RecruteurAddational.DoesNotExist:
                raise ValidationError("Le recruteur n'a pas de profil associé.")
        
        elif user.user_type == CustomUser.Types.ENTREPRISE:
            try:
                entreprise_profile = EntrepriseAddational.objects.get(user=user)
                serializer.save(entreprise=entreprise_profile)
            except EntrepriseAddational.DoesNotExist:
                raise ValidationError("L'entreprise n'a pas de profil associé.")

        else:
            raise ValidationError("Seuls les recruteurs et les entreprises peuvent créer des offres d'emploi.")
        
    @action(detail=True, methods=['get'])
    def candidatures(self, request, pk=None):
        offre = self.get_object()
        user = self.request.user
        if request.user.user_type not in [CustomUser.Types.RECRUTEUR, CustomUser.Types.ENTREPRISE]:
            return Response(status=status.HTTP_403_FORBIDDEN)
        candidatures = Candidature.objects.filter(offre=offre)
        serializer = CandidatureSerializer(candidatures, many=True)
        return Response(serializer.data)

class CandidatureViewSet(viewsets.ModelViewSet):
    serializer_class = CandidatureSerializer 
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user 

        if user.user_type == CustomUser.Types.CANDIDAT :
            return Candidature.objects.filter(candidat= user)
        else:
            if user.user_type == CustomUser.Types.RECRUTEUR :
                try:
                    recruteur_profile= RecruteurAddational.objects.get(user=user)
                    return Candidature.objects.filter(offre__recruteur = recruteur_profile)

                except RecruteurAddational.DoesNotExist:
                    raise ValidationError("Le recruteur n'a pas de profil associé.")

            elif user.user_type == CustomUser.Types.ENTREPRISE:
                try:
                    entreprise_profile = EntrepriseAddational.objects.get(user=user)
                    return Candidature.objects.filter(offre__entreprise = entreprise_profile)
                except EntrepriseAddational.DoesNotExist:
                    raise ValidationError("L'entreprise n'a pas de profil associé.")
        return Candidature.objects.none()

    """ def perform_create(self, serializer):
        serializer.save(candidat=self.request.user)        """   

class IsCandidat(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == CustomUser.Types.CANDIDAT

class CVViewSet(viewsets.ModelViewSet):
    serializer_class = CVSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidat]

    def get_queryset(self):
        return CV.objects.filter(candidat=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user

        # Vérifier si l'utilisateur est bien un candidat
        if user.user_type != CustomUser.Types.CANDIDAT:
            raise ValidationError("Seuls les candidats peuvent soumettre un CV.")

        # Vérifier si une offre d'emploi est bien spécifiée
        offre_id = self.request.data.get('offre_id')
        if not offre_id:
            raise ValidationError("Aucune offre d'emploi spécifiée.")

        # Vérifier si l'offre d'emploi existe
        try:
            offre = OffreEmploi.objects.get(id=offre_id)
        except OffreEmploi.DoesNotExist:
            raise ValidationError("L'offre d'emploi spécifiée n'existe pas.")

        # Vérifier si le candidat a déjà postulé avec un CV à cette offre
        if Candidature.objects.filter(candidat=user, offre=offre).exists():
            raise ValidationError("Vous avez déjà postulé à cette offre avec un CV.")

        # Vérifier si un fichier PDF est bien envoyé
        pdf_file = self.request.FILES.get('fichier')
        if not pdf_file:
            raise ValidationError("Aucun fichier PDF n'a été soumis.")

        # Extraire le texte du PDF
        extracted_text = self.extract_text_from_pdf(pdf_file)

        # Sauvegarder le CV et la candidature associée
        cv = serializer.save(candidat=user, extracted_text=extracted_text)

        # Créer automatiquement une candidature liée à cette offre avec le CV
        Candidature.objects.create(candidat=user, offre=offre, cv=cv)

    def extract_text_from_pdf(self, pdf_file):
        try:
            # Sauvegarde temporaire du fichier
            file_name = default_storage.save(pdf_file.name, pdf_file)
            file_path = default_storage.path(file_name)

            # Extraction du texte
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = pypdf.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"

            # Supprimer le fichier temporaire
            default_storage.delete(file_name)

            return text.strip() if text else "Aucun texte extrait du PDF."

        except Exception as e:
            raise ValidationError(f"Erreur lors de l'extraction du texte du PDF: {str(e)}")

""" 
class SearchCVsAPIView(APIView):

    
    permission_classes = [IsAuthenticated]  # ✅ Vérifie que l'utilisateur est connecté

    def post(self, request, offre_id):
        user = request.user
        
        # Vérification du type d'utilisateur
        if user.user_type not in ["Recruteur", "Entreprise"]:
            return Response({"success": False, "error": "Accès non autorisé"}, status=403)

        # Récupération de l'offre
        offre = get_object_or_404(OffreEmploi, id=offre_id)
        mots_cles = request.data.get("mots_cles", "").strip()

        if not mots_cles:
            return Response({"success": False, "error": "Veuillez saisir des mots-clés."}, status=400)

        # Exécution de la recherche
        service = CVSearchService()
        ranked_cvs = service.search_cvs(offre, mots_cles, user)

        # Sérialisation des résultats
        serializer = CVSerializer(ranked_cvs, many=True)
        
        return Response({"success": True, "cvs": serializer.data}) """