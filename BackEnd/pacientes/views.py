from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Paciente, ContactoEmergencia
from .serializers import PacienteSerializer, ContactoEmergenciaSerializer

class CrearPacienteView(generics.CreateAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'exito': True,
            'mensaje': 'Paciente y contacto de emergencia creados satisfactoriamente',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)
        
# Vista para obtener, actualizar y eliminar un paciente
class DetallePacienteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Paciente obtenido satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Paciente actualizado satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Paciente eliminado satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_204_NO_CONTENT)

# Vista para obtener y actualizar un contacto de emergencia
class DetalleContactoEmergenciaView(generics.RetrieveUpdateAPIView):
    serializer_class = ContactoEmergenciaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        paciente_id = self.kwargs.get('pk')
        return ContactoEmergencia.objects.get(paciente_id=paciente_id)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Contacto de emergencia obtenido satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Contacto de emergencia actualizado satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)
