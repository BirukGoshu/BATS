from django.shortcuts import render
from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import *
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    queryset=Product.objects.all()
    serializer_class=ProductSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset=ProductCategory.objects.all()
    serializer_class=ProductCategorySerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset=ProductImages.objects.all()
    serializer_class=ProductImageSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

class DesignViewSet(viewsets.ModelViewSet):
    queryset=Design.objects.all()
    serializer_class=DesignSerializer
    permission_classes=[permissions.IsAuthenticatedOrReadOnly]

class OrderViewSet(viewsets.ModelViewSet):
    queryset=Order.objects.all()
    serializer_class=OrderSerializer
    permission_classes=[permissions.IsAuthenticated]

class PurchaseViewSet(viewsets.ModelViewSet):  
    queryset=Purchase.objects.all()
    serializer_class=PurchaseSerializer
    permission_classes=[permissions.IsAuthenticated]