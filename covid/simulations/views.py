from django.shortcuts import render


def check_notifications(request):
    return render(request, 'main.html')
