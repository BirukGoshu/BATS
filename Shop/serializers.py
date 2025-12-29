from .models import *
from rest_framework import serializers,response
import base64,mimetypes
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from rest_framework.exceptions import ValidationError

class ProductCategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model=ProductCategory
        fields='__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=ProductImages
        fields='__all__'

        
class ProductSerializer(serializers.ModelSerializer):
    # status=serializers.CharField(read_only=True)
    cat=serializers.CharField(source='category.name',write_only=True)
    imgs=serializers.ListField(child=serializers.ImageField(),write_only=True)
    category=ProductCategorySerializer(read_only=True)
    images=ProductImageSerializer(many=True,read_only=True,source='productimages_set')
    
    class Meta:
        model=Product
        fields='__all__'

class DesignSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Design
        fields='__all__'

class OrderSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Order
        fields='__all__'

class PurchaseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Purchase
        fields='__all__'