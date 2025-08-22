from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Information', {'fields': ('first_name', 'middle_name', 'last_name', 
                                            'second_surname', 'email', 'document_type', 
                                            'document_number', 'birth_date', 'phone')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'casses': ('wide',),
            'fields': ('username', 'password1', 'password2', 'first_name', 'last_name', 'email', 'role'),
        }),
    )
    search_fields = ('username', 'first_name', 'last_name', 'email', 'numero_documento')
    ordering = ('last_name', 'first_name')

admin.site.register(Usuario, UsuarioAdmin)