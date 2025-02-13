from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.utils import timezone
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _ #traduction des texte dynamique pour plus tard
from .managers import CustomUserManager
from django.core.exceptions import ValidationError


class LowercaseEmailField(models.EmailField):
    """
    Override EmailField to convert emails to lowercase before saving.
    """
    def to_python(self, value):
        """
        Convert email to lowercase.
        """
        value = super(LowercaseEmailField, self).to_python(value)
        # Value can be None so check that it's a string before lowercasing.
        if isinstance(value, str):
            return value.lower()
        return value


class CustomUser(AbstractBaseUser , PermissionsMixin):
    email = LowercaseEmailField(_('email address'), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    phone_regex = RegexValidator( regex = r'^\d{10}$',message = "phone number should exactly be in 10 digits")
    phone = models.CharField(max_length=255, validators=[phone_regex], blank = True, null=True)  # you can set it unique = True
    
    class Types(models.TextChoices):
        RECRUTEUR = "Recruteur", "RECRUTEUR"
        ENTREPRISE = "Entreprise", "ENTREPRISE"
        CANDIDAT = "Candidat", "Candidat"

    default_type = Types.CANDIDAT
    user_type = models.CharField(max_length=20, choices=Types.choices, default=default_type)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email 
    
    def save(self, *args, **kwargs):
        is_new = not self.id
        # Sauvegarde initiale pour obtenir un ID
        super().save(*args, **kwargs)
        
        # Gestion des groupes en fonction de user_type
        if self.user_type == CustomUser.Types.RECRUTEUR:
            group_name = 'recruteur'
        elif self.user_type == CustomUser.Types.ENTREPRISE:
            group_name = 'entreprise'
        else:
            group_name = 'candidat'
        
        # Récupérer ou créer le groupe correspondant
        group, created = Group.objects.get_or_create(name=group_name)
        
        # Ajouter l'instance au groupe si elle n'y est pas déjà
        if not self.groups.filter(name=group.name).exists():
            self.groups.add(group)
        
        # Sauvegarde finale pour ajouter les groupes
        super().save(*args, **kwargs)

#Modele Recruteur & ENtreprise
class RecruteurAddational(models.Model): 
    user =  models.OneToOneField(CustomUser, on_delete = models.CASCADE)
    company = models.CharField(max_length=150)

class EntrepriseAddational(models.Model):
    user = models.OneToOneField(CustomUser, on_delete = models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)

class RecruteurManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(user_type = CustomUser.Types.RECRUTEUR)
        

class EntrepriseManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(user_type = CustomUser.Types.ENTREPRISE)
        #return super().get_queryset(*args, **kwargs).filter(Q(type__contains = CustomUser.Types.ENTREPRISE))

class CandidatManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(user_type=CustomUser.Types.CANDIDAT)

#Definition des proxy
class Recruteur(CustomUser):
    default_type = CustomUser.Types.RECRUTEUR
    objects = RecruteurManager()

    class Meta : 
        proxy = True  # # ✅ Définit ce modèle comme un proxy
    
    def recruteur(self):
        print ("Je suis un recruteur")
    
    @property
    def showadditional(self): 
        return self.recruteuradditional
    
class Entreprise (CustomUser):
    default_type = CustomUser.Types.ENTREPRISE
    objects = EntrepriseManager()

    class Meta : 
        proxy = True # ✅ Définit ce modèle comme un proxy
        
    def entreprise(self):
        print ("Je suis une entreprise")
        
    @property
    def showadditional(self): 
            return self.entrepriseadditional

class Candidat(CustomUser):
    default_type = CustomUser.Types.CANDIDAT
    objects = CandidatManager()

    class Meta:
        proxy = True

    def candidat(self):
        print("Je suis un candidat")

class OffreEmploi(models.Model):
    entreprise = models.ForeignKey(EntrepriseAddational, on_delete=models.CASCADE, related_name="offres_entreprise", null=True, blank=True)
    recruteur = models.ForeignKey(RecruteurAddational, on_delete=models.CASCADE, related_name="offres_recruteur", null=True, blank=True)
    titre = models.CharField(max_length=255)
    description = models.TextField()
    date_publication = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField(null=True, blank=True, default=timezone.now)
    localisation = models.CharField(max_length=255)
    salaire = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tag = models.TextField(null=True, blank=True, help_text="Séparer les tags par des virgules")

    def tags_list(self):
        """Retourne les tags sous forme de liste"""
        return [tag.strip() for tag in self.tag.split(",") if tag.strip()]

    def clean(self):
        """ Vérifie qu'une offre est publiée soit par une entreprise, soit par un recruteur, mais pas les deux. """
        if not self.entreprise and not self.recruteur:
            raise ValidationError("Une offre doit être associée soit à une entreprise, soit à un recruteur.")
        if self.entreprise and self.recruteur:
            raise ValidationError("Une offre ne peut pas être associée à la fois à une entreprise et à un recruteur.")

        return self.titre


# ✅ Table des CV
class CV(models.Model):
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name="cvs")
    fichier = models.FileField(upload_to="cvs/")
    extracted_text = models.TextField()
    date_telechargement = models.DateTimeField(default=timezone.now)
    score = models.FloatField(default=0)  # 🔥 Score de pertinence pour le tri

    def __str__(self):
        return f"CV de {self.candidat.email}"

# ✅ Table des mots-clés (pour le tri des CV)
class MotCle(models.Model):
    utilisateur = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="recherches")
    offre = models.ForeignKey(OffreEmploi, on_delete=models.CASCADE, related_name="recherches")
    mots_cles = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        """ Vérifie que seul un recruteur ou une entreprise peut faire une recherche. """
        if self.utilisateur.user_type not in [CustomUser.Types.RECRUTEUR, CustomUser.Types.ENTREPRISE]:
            raise ValidationError("Seuls les recruteurs et les entreprises peuvent effectuer une recherche de mots-clés.")

    def __str__(self):
        return f"Recherche de {self.utilisateur.email} sur {self.offre.titre} ({self.created_at})"



# ✅ Table des candidatures
class Candidature(models.Model):
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name="candidatures")
    offre = models.ForeignKey(OffreEmploi, on_delete=models.CASCADE, related_name="candidatures")
    cv = models.ForeignKey(CV, on_delete=models.SET_NULL, null=True, blank=True)
    lettre_motivation = models.TextField(null=True, blank=True)
    date_candidature = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(
        max_length=20,
        choices=[("En attente", "En attente"), ("Acceptée", "Acceptée"), ("Refusée", "Refusée")],
        default="En attente"
    )

    def __str__(self):
        return f"{self.candidat.email} -> {self.offre.titre} ({self.statut})"

# ✅ Gestionnaire des candidatures pour les recruteurs
class CandidatureManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(statut="En attente")



