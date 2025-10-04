from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UsuarioSerializer, SerializadorPerfilUsuario, CaseSensitiveTokenObtainPairSerializer
from utils.IsAdmin import IsAdminUser

Usuario = get_user_model()

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class UsuarioListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los usuarios y crear nuevos usuarios.
    GET: Lista todos los usuarios (requiere autenticación y ser admin)
    POST: Crea un nuevo usuario (requiere autenticación y ser admin)
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsAdminUser()]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Usuarios obtenidos satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return Response({
                'exito': True,
                'mensaje': 'Usuario creado satisfactoriamente',
                'data': response.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Manejar errores de validación del serializer
            if hasattr(e, 'detail'):
                return Response({
                    'exito': False,
                    'error': 'Error de validación',
                    'errors': e.detail
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'exito': False,
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para operaciones sobre un usuario específico.
    GET: Ver detalles de un usuario (requiere autenticación y ser admin)
    PUT/PATCH: Actualizar usuario (requiere autenticación y ser admin)
    DELETE: Eliminar usuario (requiere autenticación y ser admin)
    """
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        return [permissions.IsAuthenticated(), IsAdminUser()]

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Datos del usuario recuperados satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            return Response({
                'exito': True,
                'mensaje': 'Usuario actualizado satisfactoriamente',
                'data': response.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # Manejar errores de validación del serializer
            if hasattr(e, 'detail'):
                return Response({
                    'exito': False,
                    'error': 'Error de validación',
                    'errors': e.detail
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'exito': False,
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        username = instance.username
        self.perform_destroy(instance)
        return Response({
            'exito': True,
            'mensaje': f'Usuario {username} eliminado satisfactoriamente'
        }, status=status.HTTP_200_OK)

class ObtenerPerfilUsuarioView(generics.RetrieveAPIView):
    """
    Vista para obtener los datos completos del usuario autenticado.
    (GET)
    """
    serializer_class = SerializadorPerfilUsuario
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        """
        Retorna el usuario autenticado actual.
        """
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        """
        Extrae los datos del usuario autenticado.
        """
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                'exito': True,
                'usuario': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'exito': False,
                'error': 'Error al obtener datos del usuario',
                'detalle': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CaseSensitiveTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para login que valida el username de forma exacta (case-sensitive).
    Solo permite autenticación si el username coincide exactamente con el de la base de datos.
    """
    serializer_class = CaseSensitiveTokenObtainPairSerializer