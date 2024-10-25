# todo/tasks/views.py
from django.shortcuts import render
from django.views import generic
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
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


@require_http_methods(["DELETE"])
def delete_task(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        task.delete()
        return JsonResponse({'message': 'Task deleted', 'task_id': task_id})
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)


from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from .models import Task
import json


@csrf_exempt
@require_http_methods(["POST"])
def add_task(request):
    try:
        data = json.loads(request.body)
        task = Task.objects.create(
            title=data['title'],
            description=data['description'],
            due=data['due']
        )
        return JsonResponse({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'created': task.created.strftime('%Y-%m-%d %H:%M:%S')
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
