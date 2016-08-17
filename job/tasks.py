from celery import Task


class BaseTask(Task):
    name = None
    model = None
    abstract = True


class RunJob(BaseTask):
    """"""