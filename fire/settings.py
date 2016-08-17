"""
Django settings for fire project.

Generated by 'django-admin startproject' using Django 1.8.14.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'c#f=i+o*$v@f=wczah3-&^i%y-fwt09u_k)!9-e#)yjq3)c3-z'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'djcelery',
    
    'job',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'job.middleware.LoginRequiredMiddleware',
)

ROOT_URLCONF = 'fire.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fire.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'fire',
        'USER': 'fire',
        'PASSWORD': '',
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            #'format': '%(asctime)s %(levelname)s %(pathname)s %(lineno)d %(funcName)s %(message)s'
            'format': '%(asctime)s %(levelname)s %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'django.utils.log.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'rotating_file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'fire.log'),
            'maxBytes': 5242880,
            'backupCount': 5,
            'formatter': 'verbose'
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        }
    },
    'loggers': {
        'django': {
            'handlers': ['null'],
            'propagate': True,
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        'job.views': {
            'handlers': ['rotating_file'],
            'level': 'DEBUG',
        },
        'job.models': {
            'handlers': ['rotating_file'],
            'level': 'DEBUG',
        },
        'job.tasks': {
            'handlers': ['rotating_file'],
            'level': 'DEBUG',
        },
        'job.socket': {
            'handlers': ['rotating_file'],
            'level': 'DEBUG',
        },
        'job.utils': {
            'handlers': ['rotating_file'],
            'level': 'DEBUG',
        }
    }
}


###############################################################################
# Celery Settings
###############################################################################
import djcelery
djcelery.setup_loader()
BROKER_URL = 'redis://localhost'
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TRACE_STARTED = True
CELERY_TASK_TIME_LIMIT = None
#CELERY_TASK_SOFT_TIME_LIMIT = None
#CELERYBEAT_SCHEDULER = 'celery.beat.PersistentScheduler'
#CELERYBEAT_MAX_LOOP_INTERVAL = 60
#CELERY_RESULT_BACKEND = 'djcelery.backends.database:DatabaseBackend'
#CELERYBEAT_SCHEDULE = {
#    'phoenix_scheduler': {
#        'task': 'crane.tasks.crane_periodic_scheduler',
#        'schedule': timedelta(seconds=30)
#    }
#}
#
#SCHEDULE_METADATA_LOCATION = os.path.join(BASE_DIR, '.phoenix_cycle')


JOBOUTPUT_ROOT = os.path.join(BASE_DIR, 'job_output')
PROJECTS_ROOT = os.path.join(BASE_DIR, 'projects')
