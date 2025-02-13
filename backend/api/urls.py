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
    #path('api/cvs/search/<int:offre_id>/', views.SearchCVsAPIView, name='search_cvs'),
    path('api/', include(router.urls)),  # Inclusion du router (si tu ajoutes un ViewSet)
]