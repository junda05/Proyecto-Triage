from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('autenticacion.urls')),
    path('api/v1/pacientes/', include('pacientes.urls')),
]