from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser , RecruteurAddational, EntrepriseAddational, Candidat, OffreEmploi,CV, MotCle, Candidature


from .forms import CustomUserCreationForm, CustomUserChangeForm

User = get_user_model()

# Supprimer le modèle de groupe de l'administrateur. Nous ne l'utilisons pas.

class CustomUserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ('email', 'is_staff', 'is_active',)
    list_filter = ('email', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'phone','user_type', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions',)}),   #'is_customer' , 'is_seller'
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'user_type', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)




#admin.site.unregister(User)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(RecruteurAddational)
admin.site.register(EntrepriseAddational)
admin.site.register(Candidat)
admin.site.register(OffreEmploi)
admin.site.register(CV)
admin.site.register(MotCle)
admin.site.register(Candidature)
