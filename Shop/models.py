from django.db import models
from UserManagment.models import *

Gender= (
    ('M', 'Male'),
    ('F', 'Female'),
    ('Both','Both'),
)
Size=(
    ('S','Small'),
    ('M','Medium'),
    ('L','Large'),
    ('XL','ExtraLarge'),
    ('XXL','DoubleExtraLarge'),
)

# Create your models here.
class ProductCategory(models.Model):
    name=models.CharField(max_length=50)
    description=models.TextField(null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table='ProductCategory'

class Product(models.Model):
    name=models.CharField(max_length=50)
    description=models.TextField(null=True)
    gender=models.CharField(max_length=10,choices=Gender,blank=True,null=True)
    size=models.CharField(max_length=50,choices=Size,blank=True,null=True)
    category=models.ForeignKey(ProductCategory,on_delete=models.SET_NULL,blank=True,null=True)
    price=models.FloatField(blank=True,null=True)
    length=models.FloatField(blank=True,null=True)
    width=models.FloatField(blank=True,null=True)
    manufacture_price=models.FloatField(blank=True,null=True)
    discount=models.FloatField(default=0.0)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    available=models.BooleanField(default=True)
    owner=models.ForeignKey('UserManagment.Users',on_delete=models.CASCADE)

    class Meta:
        db_table='Product'

class ProductImages(models.Model):
    Product=models.ForeignKey(Product,on_delete=models.CASCADE)
    images=models.ImageField(upload_to='static/product/')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table='ProductImages'

class Purchase(models.Model):
    user=models.ForeignKey('UserManagment.Users',on_delete=models.CASCADE)
    Product=models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    quantity=models.FloatField()
    size=models.CharField(max_length=50,choices=Size,blank=True,null=True)
    total_price=models.FloatField()
    checkoutdata=models.JSONField(blank=True,null=True)
    paymentdata=models.JSONField(blank=True,null=True)
    paid=models.BooleanField(default=False)
    complete=models.BooleanField(default=False)
    declined=models.BooleanField(default=False)
    declinedReason=models.TextField(null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table='ProductPurchase'

class Order(models.Model):
    user=models.ForeignKey('UserManagment.Users',on_delete=models.CASCADE)
    category=models.ForeignKey(ProductCategory,on_delete=models.SET_NULL,null=True)
    quantity=models.FloatField()
    description=models.TextField(null=True)
    total_price=models.FloatField(blank=True,null=True)
    length=models.FloatField(blank=True,null=True)
    width=models.FloatField(blank=True,null=True)
    size=models.CharField(max_length=50,choices=Size,blank=True,null=True)
    checkoutdata=models.JSONField(blank=True,null=True)
    paymentdata=models.JSONField(blank=True,null=True)
    paid=models.BooleanField(default=False)
    complete=models.BooleanField(default=False)
    declined=models.BooleanField(default=False)
    declinedReason=models.TextField(null=True)
    deliverydate=models.DateTimeField(blank=True,null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        db_table='Order'

class Design(models.Model):
    name=models.CharField(max_length=50)
    description=models.TextField(null=True)
    file=models.FileField(upload_to='design/')
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table='Design'