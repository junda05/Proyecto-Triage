from django.urls import path
from . import views

app_name = 'reportes'

urlpatterns = [
    path('dashboard/', views.ReporteDashboardView.as_view(), name='reporte-dashboard'),
]