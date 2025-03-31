from django.urls import path
from .views import template_list, home

urlpatterns = [
    path('', home, name='home'),
    path('api/templates/', template_list, name='template_list'),
]