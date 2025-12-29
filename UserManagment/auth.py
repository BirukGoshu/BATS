from rest_framework import authentication
from rest_framework import authentication, response
# import pyrebase
import json
from django.contrib.auth import login, logout
from django.contrib.auth.models import auth as au
from .models import Users
# from django.views.decorators.csrf import csrf_exempt
from .exceptions import InvalidCredentials
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.core import serializers as ser



# for user in Users.objects.all():
#     Token.objects.get_or_create(user=Users)


# config = {
#     'apiKey': "AIzaSyDZyeUIesDHjNcIkI8EEewB8V30Lweopw4",
#     'authDomain': "end-to-end-ims.firebaseapp.com",
#     'projectId': "end-to-end-ims",
#     'storageBucket': "end-to-end-ims.appspot.com",
#     'messagingSenderId': "195823962089",
#     'appId': "1:195823962089:web:437bef9cc7b066e582ad78",
#     'measurementId': "G-37W1HX7DL6",
#     "databaseURL": ""
# }

# firebase = pyrebase.initialize_app(config)
# authe = firebase.auth()


class BearerAuthentication(authentication.TokenAuthentication):

    def authenticate(self, request):
        keyword = ['token', 'bearer']
        #if request.method=='POST' and request.data['email']:
            #request.data['username']=request.data['email']
        auth = authentication.get_authorization_header(request).split()
        # username = request[]
        # print(request.META.get("HTTP_AUTHORIZATION").split(" ").pop())
        if not auth:
            return None
        if auth[0].lower().decode() not in keyword:
            return None
        if len(auth) == 1:
            msg = _('Invalid token header. No credentials provided.')
            raise authentication.exceptions.AuthenticationFailed(msg)
            # ruturn None
        elif len(auth) > 2:
            msg = _('Invalid token header. Token string should not contain spaces.')
            raise authentication.exceptions.AuthenticationFailed(msg)
            # ruturn None
        #if auth[1] == b'null' and request.method == 'POST' and request.data['email']:
            # if request.method == 'POST' and request.data['email']:
                # if request.data['username']:
                #     email = request.data['username']
                # elif request.data['email']:
            #request.data['username']=request.data['email']
            #email = request.data['email']
            #password = request.data['password']
            # print(email,password)
            #user = Users.objects.get(email=email)
            #token = Token.objects.get(user=user).key
            #serializer = ser.serialize("json",Users.objects.filter(email=request.data['email']))
            #use = json.loads(serializer)[0]
            #resp = {}
            #resp.update(use)
            #print(resp)
            #return (resp,token)
            # print(email)
            # print(token)
            # return response.Response(user,token)
        elif auth[1] == b'null':
            return None

        elif auth[1] == b'undefined':
            return None
           # token = auth[1].decode()
            #print('decoded token')
            #print(token)

            # print(token)
           # user = Users.objects.get(email=Token.objects.get(key=token).user)
            # if user:
            #     auth.login(request, user)
            #print(user)
            #return (self.authenticate_credentials(token))
            # else:
            #     raise authentication.exceptions.AuthenticationFailed('no token or credential supplied')

        try:
            token = auth[1].decode()
            #user = Users.objects.get(email=Token.objects.get(key=token).user)
            #print(user)
        except UnicodeError:
            msg = _('Invalid token header. Token string should not contain invalid characters.')
            raise authentication.TokenAuthentication.exceptions.AuthenticationFailed(msg)
        return (self.authenticate_credentials(token))


# class FirebaseAuthentication(authentication.BaseAuthentication):
#     @csrf_exempt
#     def authenticate(self, request):
#         print(request.data)
#         keyword = ['token', 'bearer']
#         # if request.data['username']:
#         #     email = request.data.get('username', None)
#         # if request.data['email']:
#         #     email = request.data.get('email', None)
#         # password = request.data.get('password', None)
#         # Code = request.data.get('Code', None)
#         # print(email,password)
#         auth = authentication.get_authorization_header(request).split()
#         # if auth:
#         # tok = request.META.get("HTTP_AUTHORIZATION").split(" ").pop()
#         # print(tok)
#         # print(request.auth)
#         if not auth:
#             return None
#         if auth[0].lower().decode() not in keyword:
#             return None
#         if len(auth) == 1:
#             msg = _('Invalid token header. No credentials provided.')
#             raise authentication.exceptions.AuthenticationFailed(msg)
#         elif len(auth) > 2:
#             msg = _('Invalid token header. Token string should not contain spaces.')
#             raise authentication.exceptions.AuthenticationFailed(msg)
#         if auth[1] != 'null' and request.method == 'POST' and request.data['email']:
#             request.data['username'] = request.data['email']
#             email = request.data['email']
#             password = request.data['password']
#             print(email,password)
#             user = Users.objects.get(email=email)
#             token = authe.sign_in_with_email_and_password(email,password)
#             token = authe.refresh(token['refreshToken'])
#             auth[1] = token['idToken']
#                 # return self.authenticate_credentials(token['idToken'])
#         else:
#             token = authe.get_account_info(auth[1])
#             email = token['users'][0]['email']
#             user = Users.objects.get(email=email)
#             return (user, token['idToken'])
            # raise authentication.exceptions.AuthenticationFailed('no token or credential supplied')

        # try:
        #     # token = auth[1].decode()
        #     # token = authe.get_account_info(tok[1])
        #     token = authe.get_account_info(auth[1])
        #     email = token['users'][0]['email']
        #     user = Users.objects.get(email=email)
        #     # token = authe.refresh(token['refreshToken'])
        #     # if user:
        #     #     auth.login(request,user)
        #     # token = authe.sign_in_with_custom_token(tok[1])
        # except UnicodeError:
        #     msg = _('Invalid token header. Token string should not contain invalid characters.')
        #     raise authentication.exceptions.AuthenticationFailed(msg)
        # return (user, token['idToken'])
            # if request.method == 'POST':
        # elif email and password:
        #     print(email,password)
        #     u=authe.sign_in_with_email_and_password(email,password)
        #     # request.
        #     # us = Users.objects.get(email=email)
        #     user = auth.authenticate(email=email, password=password)
        #     if user:
        #         auth.login(request, user)
        #         payload = {'message':{'head': 'successful login', 'body': 'welcome {}'.format(email)}}
        #         # send_user_notification(user = us, payload = payload, ttl=1000)

        #         # data = serializer
        #         # request.auth = u['idToken']
        #     # if request.POST['email'] and request.POST['Code']:
        #     #     verify = client.verify.services(TWILIO_VERIFY_SERVICE_SID)
        #     #     result = verify.verification_checks.create(to=str(Users.objects.get(email=email).Phone), code=request.POST['Code'])
        #     #     return response.Response([u['email'],u['idToken'],result.status])payload,use,
        #         serializer = ser.serialize("json",Users.objects.filter(email=email))
        #         use = json.loads(serializer)[0]
        #         resp = {}
        #         resp.update(payload)
        #         resp.update(use)
        #         resp.update({'Token':u['idToken']})
        #         return response.Response(resp, headers={'Authorization': "Bearer {}".format(u['idToken'])})
        #         # return (user,u['idToken'])
        #     else:
        #         raise exceptions.AuthenticationFailed(_('Invalid email/password.'))
        # elif email and Code:
        #     # email = request.data['email']
        #     # code = request.data['Code']
        #     user = Users.objects.get(email=email)
        #     #u=authe.sign_in_with_email_and_password(email,us.password)
        #     if us and us.otp==Code:
        #         auth.login(request, us)
        #         payload = {'head': 'successful login', 'body': 'welcome {}'.format(us.email)}
        #         send_user_notification(user = us, payload = payload, ttl=1000)
        #         serializer = ser.serialize("json",Users.objects.filter(email=email))
        #         use = json.loads(serializer)[0]
        #         resp = {}
        #         resp.update(payload)
        #         resp.update(use)
        #         resp.update({'Token':u['idToken']})
        #         return response.Response(resp, headers={'Authorization': "Bearer {}".format(u['idToken'])})
        #         # return user
        #     else:
        #         raise exceptions.AuthenticationFailed(_('Invalid email/OTP code.'))
        # else:
        #     msg = 'Authorization Token not supplied'
        #     raise authentication.exceptions.AuthenticationFailed(msg)
        # tok = authentication.get_authorization_header(request).split()
        # tok = None
        # print(request.META.get("HTTP_AUTHORIZATION"))
        # print(request.data['email'])

            # email=username
            # password=password
            # print('test')
            # print(self.authenticate_header(request))
            #     # if there is no error then signin the user with given email and password
            # user=authe.sign_in_with_email_and_password(email,password)
            # print(user)
            # authe.send_email_verification(user['idToken'])
            # if request.method=='POST':
            #     if request.POST['email'] and request.POST['password']:
            #         email = request.POST['email']
            #         password = request.POST['password']

            #     u = Users.objects.get(email=email)
            #     user=authe.sign_in_with_email_and_password(email,password)
            #     if request.POST['code']:
            #         code = request.POST['code']
            #         result = verify.verification_checks.create(to=str(u.Phone), code=request.POST['Code'])

            #     return response.Response(u,user['idtoken'])

            # print(token)
            # if not token:
            #     return None
            #     print('token empty')

            # try:
            #     decoded_token = authe.verify_id_token(token)
            #     # uid = decoded_token["uid"]
            #     print(decoded_token)
            #     return decoded_token
            # except:
            #      raise InvalidCredentials('Invalid Credentials')
    #         messages.error(request, "Invalid Credentials!!Please ChecK your Data")

            # token = request.headers.get('Authorization')
            # if not token:
            #     return None

            # try:
            #     decoded_token = authe.verify_id_token(token)
            #     # uid = decoded_token["uid"]
            #     email = decoded_token['email']
            # except:
            #     return None

            # try:
            #     user = Users.objects.get(email=email)
            #     return user

            # except ObjectDoesNotExist:
            #     return None
