from django.urls import path
from .views import (
    PreguntaListView, 
    PreguntaDetailView,
    SesionTriageListView,
    SesionTriageDetailView,
    RespuestaCreate, 
    IniciarTriage,
    CargarPreguntas
)

urlpatterns = [
    # Rutas para preguntas
    path('preguntas', PreguntaListView.as_view(), name='pregunta-list'),
    path('preguntas/<str:pk>', PreguntaDetailView.as_view(), name='pregunta-detail'),
    
    # Rutas para sesiones
    path('sesiones', SesionTriageListView.as_view(), name='sesion-list'),
    path('sesiones/<str:pk>', SesionTriageDetailView.as_view(), name='sesion-detail'),
    
    # Otras rutas
    path('respuesta', RespuestaCreate.as_view(), name='respuesta-create'),
    path('iniciar', IniciarTriage.as_view(), name='iniciar-triage'),
    path('cargar-preguntas', CargarPreguntas.as_view(), name='cargar-preguntas'),
]
