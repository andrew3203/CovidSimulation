from django.urls import path
from django.contrib.auth import views as dj_views
from . import views

app_name = 'simulations'
urlpatterns = [
     path('', views.check_notifications, name='main'),
     path('get_hist_data/', views.send_json, name='hist'),
]
