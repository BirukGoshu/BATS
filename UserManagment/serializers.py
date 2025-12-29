from .models import *
from rest_framework import serializers,response
import base64,mimetypes
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from rest_framework.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    status=serializers.CharField(read_only=True)
    
    class Meta:
        model=Users
        fields='__all__'

class AgentSerializer(serializers.ModelSerializer):
    status=serializers.CharField(read_only=True)
    
    class Meta:
        model=Agent
        fields='__all__'

    # def to_internal_value(self,attrs):
    #     if 'license' in attrs and attrs['license'] is not None:
    #         content_type, file_data = license.split(';base64,')
    #         decoded_file = base64.b64decode(file_data)
    #         print('file decoded')
    #         content_type=content_type.split(':')[1]
    #         # Create an InMemoryUploadedFile
    #         license_file = InMemoryUploadedFile(
    #             file=BytesIO(decoded_file),
    #             field_name=None,
    #             name='license{}'.format(mimetypes.guess_extension(content_type, strict=False)),  # Customize the filename
    #             content_type=content_type,  # Customize the content type based on your image format
    #             size=len(decoded_file),
    #             charset=None,
    #         )
    #         attrs['license']=license_file
    #     elif 'license' in attrs and (attrs['license'] == '' or attrs['license'] == []):
    #         attrs.pop('license')
    #     return super().to_internal_value(attrs)

class DesignerSerializer(serializers.ModelSerializer):
    status=serializers.CharField(read_only=True)
    
    class Meta:
        model=Designer
        fields='__all__'

class CompanySerializer(serializers.ModelSerializer):
    status=serializers.CharField(read_only=True)
    
    class Meta:
        model=Company
        fields='__all__'
        
class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation=serializers.CharField(write_only=True)
    group=serializers.CharField(write_only=True)

    class Meta:
        model=Users
        fields=('email','username','password','password_confirmation','group')

    def create(self,validated_data):
        if validated_data['password'] != validated_data['password_confirmation']:
            raise ValidationError('passwords don\'t match')
        if 'agent' in validated_data['group'].lower():
            serializer=AgentSerializer(data=self.context['request'].data)
            if serializer.is_valid():
                serializer.save()
                us=Users.objects.get(email=validated_data['email'])
            else:
                raise ValidationError(serializer.errors)
        if 'designer' in validated_data['group'].lower():
            serializer=DesignerSerializer(data=self.context['request'].data)
            if serializer.is_valid():
                serializer.save()
                us=Users.objects.get(email=validated_data['email'])
            else:
                raise ValidationError(serializer.errors)
        elif 'company' in validated_data['group'].lower():
            serializer=CompanySerializer(data=self.context['request'].data)
            if serializer.is_valid():
                serializer.save()
                us=Users.objects.get(email=validated_data['email'])
            else:
                raise ValidationError(serializer.errors)
        elif 'client' in validated_data['group'].lower():
            validated_data.pop('group')
            validated_data.pop('password_confirmation')
            us=Users.objects.create(**validated_data)
            us.set_password(validated_data['password'])
            us.save()
        else:
            raise ValidationError('invalid group supplied')
        return us

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, allow_null=True)
    # code = serializers.CharField(write_only=True,required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Users
        fields = ('email','password')