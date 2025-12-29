from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.

class Users(AbstractUser):
    email = models.EmailField(unique=True)
    phone = PhoneNumberField(region='ET', blank=True)
    ProfilePicture = models.ImageField(upload_to='uploads/profile',blank=True)
    status = models.CharField(max_length=191, default='active')
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deactivated=models.BooleanField(default=False)
    deactivatedReason=models.TextField(null=True,blank=True)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'

class Company(Users):
    companyname=models.CharField(max_length=30,blank=True,null=True)

    class Meta:
        db_table='company'

class Agent(Users):
    license=models.FileField(upload_to='agent/',blank=True,null=True)

    class Meta:
        db_table='agent'

class Designer(Users):
    portfolio=models.FileField(upload_to='designer/',blank=True,null=True)

    class Meta:
        db_table='Designer'
