from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views
# from Shop.urls import router as shopurl


router = routers.DefaultRouter()
router.register(r'users',views.UsersViewSet,basename='users')
router.register(r'company',views.CompanyViewSet,basename='company')
router.register(r'agent',views.AgentViewSet,basename='agent')
router.register(r'register',views.RegisterUser,basename='registerpython')
router.register(r'login',views.LoginViewSet,basename='login')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('',include('Shop.urls'))
]