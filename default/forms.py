from django import forms
from django.contrib.auth.models import User
from django.conf import settings

import logging

from models import Clover
from api.api import CloverAPI

# Get an instance of a logger
logger = logging.getLogger(__name__)

EMAIL_MSG = '''
    Hi there,

    Thank you for testing and sending feedbacks about Cloverite.
    
    Our goal is to provide the best user experience possible and your comments will help us get there!

    If you provided us your email, we will be sure to give you a reply.
    
    Thanks,
    Cloverite
'''

class FeedbackForm(forms.Form):
    userEmail = forms.EmailField(required=False)
    pageurl = forms.URLField(max_length=1000)
    feedback = forms.CharField()

    def clean_feedback(self):
        message = self.cleaned_data['feedback']
        '''
        if len(message) < 12:
            raise forms.ValidationError('Please supply more feedback.')
        '''
        return message

class SignupForm(forms.Form):
    username  = forms.CharField()
    email     = forms.EmailField()
    password  = forms.CharField()

    def clean_email(self):
        try:
            User.objects.get(email__iexact=self.cleaned_data['email'])
        except User.DoesNotExist:
            return self.cleaned_data['email']
        raise forms.ValidationError(u'Email already registered. Please choose another.')

    def clean_username(self):
        try:
            User.objects.get(username__iexact=self.cleaned_data['username'])
        except User.DoesNotExist:
            return self.cleaned_data['username']
        raise forms.ValidationError(u'Username already registered. Please choose another.')

    def save(self):
        newUser = User.objects.create_user(self.cleaned_data['username'],
                self.cleaned_data['email'],
                self.cleaned_data['password'])
        
        apiData = CloverAPI.createNewUser(newUser.username, newUser.email)

        if apiData:
            newUser.save()

        newClover = Clover(user = newUser, neo4jId = apiData['payload']['id'])
        newClover.save()

        return newClover
