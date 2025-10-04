from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from .views import UsuarioListCreateView, UsuarioDetailView, ObtenerPerfilUsuarioView, CaseSensitiveTokenObtainPairView

urlpatterns = [
    # Autenticación y endpoints de tokens
    # POST /api/v1/auth/login - Obtener tokens JWT usando nombre de usuario y contraseña (case-sensitive)
    path('login', CaseSensitiveTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # POST /api/v1/auth/refresh-access - Refrescar el token de acceso cuando expire
    path('refresh-access', TokenRefreshView.as_view(), name='token_refresh'),

    # POST /api/v1/auth/logout - Invalidar (blacklist) el token de actualización al cerrar sesión
    path('logout', TokenBlacklistView.as_view(), name='token_blacklist'),

    # Endpoints de gestión de usuarios
    # GET /api/v1/auth/usuarios - Listar todos los usuarios (solo administradores)
    # POST /api/v1/auth/usuarios - Crear un nuevo usuario (solo administradores)
    path('usuarios', UsuarioListCreateView.as_view(), name='usuario-list-create'),

    # GET /api/v1/auth/usuarios/{id} - Obtener detalles de un usuario (solo administradores)
    # PUT /api/v1/auth/usuarios/{id} - Actualizar usuario (solo administradores)
    # PATCH /api/v1/auth/usuarios/{id} - Actualización parcial del usuario (solo administradores)
    # DELETE /api/v1/auth/usuarios/{id} - Eliminar usuario (solo administradores)
    path('usuarios/<int:pk>', UsuarioDetailView.as_view(), name='usuario-detail'),
    
    # Endpoint del perfil del usuario actual
    # GET /api/v1/auth/perfil - Obtener el perfil del usuario autenticado actual
    path('perfil', ObtenerPerfilUsuarioView.as_view(), name='obtener_perfil'),
]