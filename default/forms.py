from django import forms
from django.contrib.auth.models import User

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
        if len(message) < 12:
            raise forms.ValidationError('Please supply more feedback.')
        return message

class SignupForm(forms.Form):
    email = forms.EmailField()
    pwd = forms.CharField()
    pwdAgain = forms.CharField()

    def clean_email(self):
        """
            Validate that the username is alphanumeric and is not already in use.
        """
        try:
            user = User.objects.get(email__iexact=self.cleaned_data['email'])
        except User.DoesNotExist:
            return self.cleaned_data['email']

        raise forms.ValidationError(u'Email already registered. Please choose another.')

    def save(self):
        newUser = User.objects.create_user(self.cleaned_data['email'],
                        self.cleaned_data['email'],
                        self.cleaned_data['pwd'])
        newUser.save()
        return newUser
