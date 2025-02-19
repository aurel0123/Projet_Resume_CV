from django.urls import path , include
#from .views import *
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'offres' , views.OffreEmploiViewSet , basename="offres")
router.register(r'candidatures' , views.CandidatureViewSet , basename="candidatures")
router.register(r'cvs', views.CVViewSet , basename='cv')

urlpatterns = [
    path('api/register/', views.register_user, name='register_user'),  # Inscription
    path('api/login/', views.login_user, name='login_user'),  # Connexion
    path('api/profile/', views.update_profile),
    path('api/profile/password/', views.update_password),
    path('api/profile/image/', views.update_profile_image),
    path('api/offres-entreprise/', views.get_offres_par_entreprise , name = 'offres par entreprise'),
    path('api/offres-recruteur/', views.get_offres_par_recruteur , name = 'offres par recruteur'),
    path('api/cvs/search/<int:offre_id>/', views.search_candidatures, name='search_cvs'),
    path('api/dashboard/stats/', views.get_dashboard_stats, name='dashbord'),
    path('api/', include(router.urls)),  # Inclusion du router (si tu ajoutes un ViewSet)

]