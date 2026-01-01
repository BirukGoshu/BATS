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
    owner=serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model=Product
        fields='__all__'

    def create(self,validated_data):
        imgs=validated_data.pop('imgs',[])
        category=validated_data.pop('cat')
        category=ProductCategory.objects.get(name=category)
        validated_data['category']=category
        # validated_data['owner']=self.context['request'].user
        product=Product.objects.create(**validated_data)
        for img in imgs:
            ProductImages.objects.create(Product=product,images=img)
        return product

class DesignSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=Design
        fields='__all__'

class OrderSerializer(serializers.ModelSerializer):
    user=serializers.HiddenField(default=serializers.CurrentUserDefault())
    category=serializers.CharField(source='category.name',read_only=True)
    
    class Meta:
        model=Order
        fields='__all__'

    # def create(self,validated_data):
    #     # category=validated_data.pop('cat')
    #     # category=ProductCategory.objects.get(name=category)
    #     # validated_data['category']=category
    #     # validated_data['user']=self.context['request'].user
    #     order=Order.objects.create(**validated_data)
    #     return order

class PurchaseSerializer(serializers.ModelSerializer):
    Product=serializers.CharField(source='Product.name',read_only=True)
    user=serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model=Purchase
        fields='__all__'

    def create(self,validated_data):
        validated_data['total_price']=validated_data['quantity']*validated_data['Product'].price
        # validated_data['user']=self.context['request'].user
        purchase=Purchase.objects.create(**validated_data)
        return purchase