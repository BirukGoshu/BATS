from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'product',views.ProductViewSet,basename='product')
router.register(r'productcategory',views.ProductCategoryViewSet,basename='product-category')
router.register(r'productimage',views.ProductImageViewSet,basename='product-image')
router.register(r'design',views.DesignViewSet,basename='design')
router.register(r'order',views.OrderViewSet,basename='order')
router.register(r'purchase',views.PurchaseViewSet,basename='purchase')

urlpatterns = [
    path('', include(router.urls)),
]