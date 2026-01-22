from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import *
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import auth
from django.core import serializers as ser
from rest_framework import response
import json
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
# Create your views here.

class UsersViewSet(viewsets.ModelViewSet):
    queryset=Users.objects.all()
    serializer_class=UserSerializer
    permission_classes=[permissions.IsAuthenticated]

    @action(detail=False,methods=['POST'])
    def logout(self,request):
        user=request.user
        print(f'logout user {user.email}')
        # us=auth.authenticate(email=user.email)
        # print(f'us = {us}')
        token=Token.objects.filter(user=user)
        print(f'token={token}')
        token.delete()
        auth.logout(request)
        return response.Response('logout succesful')
    
    @action(detail=False,methods=['POST'])
    def update_password(self,request):
        user=request.user
        if request.data['old_password'] and request.data['new_password'] and request.data['confirm_password']:
            if request.data['new_password'] != request.data['confirm_password']:
                return response.Response('passwords don\'t match',status=422)
            if not user.check_password(request.data['old_password']):
                return response.Response('old password is incorrect',status=422)
        password=request.data['new_password']
        user.set_password(password)
        user.save()
        return response.Response('password updated successfully')
    
    @action(detail=False,methods=['PUT'])
    def edit_profile(self,request):
        user=request.user
        if 'email' in request.data:
            email=request.data['email']
            if email != user.email and Users.objects.filter(email=email).exists():
                return response.Response('email already exists',status=422)
            user.email=email
            user.username=email
        if 'phone' in request.data:
            phone=request.data['phone']
            user.phone=phone
        if 'profile_picture' in request.data:
            profile_picture=request.data['profile_picture']
            user.profile_picture=profile_picture
        user.save()
        return response.Response('profile updated successfully')

class CompanyViewSet(viewsets.ModelViewSet):
    queryset=Company.objects.all()
    serializer_class=CompanySerializer
    permission_classes=[permissions.IsAuthenticated]

class AgentViewSet(viewsets.ModelViewSet):
    queryset=Agent.objects.all()
    serializer_class=AgentSerializer
    permission_classes=[permissions.IsAuthenticated]

class RegisterUser(CreateModelMixin, GenericViewSet):
    model = Users
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginViewSet(GenericViewSet,ListModelMixin):
    queryset = Users.objects.none()
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self,request):
        if request.data['email'] and 'password' in request.data and request.data['password']:
            email = request.data['email']
            password = request.data['password']
            # u=authe.sign_in_with_email_and_password(email,password),u['idToken']]
            # us = users.objects.get(username=username)
            user = auth.authenticate(email=email, password=password)
            if user:
                if user.deactivated==False:
                    auth.login(request, user)
                    token = Token.objects.get_or_create(user=user)[0].key
                    u = ser.serialize("json",Users.objects.filter(email=email))
                    use = json.loads(u)[0]
                    resp = {}
                    resp.update(use['fields'])
                    return response.Response({'token': token, 'user': resp})
                    # return response.Response('{} successfully logged in your token is {}'.format(user.email,token))
                else:
                    return response.Response('{} account has been disabled please contact our staff'.format(user.username),status=422)
            else:
                return response.Response('invalid creds',status=422)
        else:
                return response.Response('username or password not supplied',status=422)