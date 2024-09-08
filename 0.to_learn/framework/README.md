
+ pipenv shell
+ django-admin startproject worldtour
+ cd worldtour
+ python3 manage.py startapp asiatoursagency
+ python3 manage.py runserver
+ in worldtour/settings.py add 'asiatoursagency.apps.AsiatoursagencyConfig' to INSTALLED_APPS
+ in asiatoursagency/views.py add:
    from django.http import HttpResponse
    def index(request):
        return HttpResponse("Asia Tours Agency")
+ create urls.py in asiatoursagency:
    from django.urls import path
    from . import views
    urlpatterns = [ path("", views.index) ]
+ in worldtour/urls.py:
    from django.contrib import admin
    from django.urls import path, include
    urlpatterns = [ path('admin/', admin.site.urls), path("", include("asiatoursagency.urls")) ]
+ in worldtour/asiatoursagency/models.py:
    from django.db import models
    class Tour(models.Model):
        origin_country = models.CharField(max_length=64)
        destination_country = models.CharField(max_length=64)
        number_of_nights = models.IntegerField()
        price = models.IntegerField()
+ run python3 manage.py makemigrations
+ run python3 manage.py migrate

    
+ server:
    + django-admin startproject django_project
    + cd django_project
    + python3 manage.py startapp django_app
    + mkdir django_app/static
    + mkdir django_app/static/images
    + mkdir django_app/static/styles
    + mkdir django_app/static/js
    + mkdir django_app/templates
    + mkdir django_app/templates/django_app
    + touch django_app/templates/django_app/index.html
    + in django_project/django_app/settings.py:
        + add "django_app" to INSTALLED_APPS
        +   import os
            STATIC_URL = 'static/'
            STATICFILES_DIRS = (
                os.path.join(BASE_DIR, "static"),
            )
    + in django_app/views.py:
        def index(request):
            return render(request, "django_app/index.html")
    + create django_app/urls.py:
        from django.urls import path
        from .views import index
        urlpatterns = [path("", index, name="index"),]
    + in django_project/urls.py:
        from django.contrib import admin
        from django.urls import path, include
        urlpatterns = [path('admin/', admin.site.urls),path("", include("django_app.urls"))]
    + in django_app/templates/django_app/index.html:
        + add this line at the beginning: {% load static %}



