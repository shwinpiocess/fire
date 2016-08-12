from django.shortcuts import redirect
from django.core.urlresolvers import reverse


class LoginRequiredMiddleware(object):

    def process_request(self, request):
        login_url = reverse('job:login')
        if not request.user.is_authenticated() and request.path != login_url:
            return redirect(login_url)
