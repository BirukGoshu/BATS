from rest_framework import status
from rest_framework.exceptions import APIException, ValidationError
# from rest_framework import status

class NoAuthToken(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'No authentication token provided'
    default_code = 'invalid credintials'

class InvalidCredentials(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Invalid Credentials!!Please ChecK your Data'
    default_code = 'invalid credintials'

class EmailNotVerified(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'the User email is not verified'
    default_code = 'email not verified'

class ValidationErrors(APIException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = 'the data you have entered is not valid'
    default_code = 'Invalid Data'

def custom_exception_handler(exc, context):
    from rest_framework.views import exception_handler
    response = exception_handler(exc, context)

    if isinstance(exc, ValidationError) and response is not None:
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY

    return response