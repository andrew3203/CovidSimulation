from django.urls import path
from django.contrib.auth import views as dj_views
from . import views

#app_name = 'simulations'
urlpatterns = [
     path('', views.get_page, name='main'),
     path('get_hist_data/', views.get_hist_data, name='hist'),
     path('get_all_regions/', views.get_all_regions, name='regions'),
     path('map/', views.covid_map, name='map'),
]
