from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = 'Create groups and assign permissions'

    def handle(self, *args, **kwargs):
        groups_permissions = {
        'candidat': [
            'view_offreemploi',  # Pour voir les offres d'emploi
            'add_candidature',    # Pour postuler
            'view_candidature',   # Pour voir ses candidatures
            'add_cv',            # Pour ajouter son CV
            'view_cv',           # Pour voir ses CVs
        ],
        'entreprise': [
            'view_offreemploi',   # Pour voir les offres
            'add_offreemploi',    # Pour créer des offres
            'change_offreemploi', # Pour modifier ses offres
            'delete_offreemploi', # Pour supprimer ses offres
            'view_candidature',   # Pour voir les candidatures
            'view_cv',           # Pour voir les CVs des candidats
            'add_motcle',        # Pour ajouter des mots-clés de recherche
            'change_candidature', # Pour modifier le statut des candidatures
        ],
        'recruteur': [
            'view_offreemploi',   # Pour voir les offres
            'add_offreemploi',    # Pour créer des offres
            'change_offreemploi', # Pour modifier ses offres
            'delete_offreemploi', # Pour supprimer ses offres
            'view_candidature',   # Pour voir les candidatures
            'change_candidature', # Pour modifier le statut des candidatures
            'view_cv',           # Pour voir les CVs
            'add_motcle',        # Pour ajouter des mots-clés de recherche
        ]
    }

        for group_name, perms in groups_permissions.items():
            group, created = Group.objects.get_or_create(name=group_name)
            
            for perm_codename in perms:
                try:
                    permission = Permission.objects.get(codename=perm_codename)
                    group.permissions.add(permission)
                    self.stdout.write(self.style.SUCCESS(f"Permission {perm_codename} ajoutée au groupe {group_name}"))
                except Permission.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Attention: La permission {perm_codename} n'existe pas"))

            self.stdout.write(self.style.SUCCESS(f"Groupe {group_name} mis à jour avec ses permissions."))