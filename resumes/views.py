from django.shortcuts import render
from .models import ResumeTemplate
from django.http import JsonResponse

def template_list(request):
    templates = ResumeTemplate.objects.all()
    return JsonResponse(list(templates.values()), safe=False)

def home(request):
    return render(request, 'home.html')