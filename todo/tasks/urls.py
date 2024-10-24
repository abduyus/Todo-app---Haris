from django.urls import path
from . import views

urlpatterns = [
    path("", views.task_list, name='task_list'),
    path('task/<int:pk>/', views.TaskDetail.as_view(), name='task_detail'),
]