+ build a django app: 
    + python3 -m django startproject mysite
    + python3 manage.py runserver
+ POLL app:
    + python3 manage.py startapp polls


python3 -m django startproject mysite
cd myproject
python3 manage.py startapp myapp

python3 manage.py runserve

python3 -m django startproject demo
+ create app:
    + python3 manage.py startapp myapp
    + go to demo/setting.py
    + add "myapp" to INSTALLED_APPS
    + create urls.py in /myapp
    + in myapp/views.py:
        def home(request):
            return HttpResponse("hello world!")
    + in myapp/urls.py:
        from django.urls import path
        from . import views
        urlpatterns = [
            path("", views.home, name="home")
        ]
    + in demo/urls.py:
        from django.urls import path, include
        urlpatterns = [
            path('admin/', admin.site.urls),
            path("", include("myapp.urls"))
        ]
    + in myapp create dir templates
        + inside templates file put base.html
    + in myapp/views.py:
        def home(request):
            return render(request, "home.html")
    + python3 manage.py runserver

    