# todo/tasks/views.py
from django.shortcuts import render
from django.views import generic
from .models import Task

class TaskList(generic.ListView):
    queryset = Task.objects.order_by("-created")
    template_name = "tasks/index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class TaskDetail(generic.DetailView):
    model = Task
    template_name = "tasks/task_detail.html"

def task_list(request):
    tasks = Task.objects.all()
    return render(request, 'tasks/index.html', {'tasks': tasks})