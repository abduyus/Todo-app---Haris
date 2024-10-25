from django.urls import path
from . import views

urlpatterns = [
    path("", views.task_list, name='task_list'),
    path('task/<int:pk>/', views.TaskDetail.as_view(), name='task_detail'),
    path('api/delete/<int:task_id>/', views.delete_task, name='delete_task'),
    path('api/add/', views.add_task, name='add_task'),
]
