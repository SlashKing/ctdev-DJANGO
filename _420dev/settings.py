
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import datetime
# import pymysql

# pymysql.install_as_MySQLdb()

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

ADMINS = (
    ('Nick LeBlanc', 'n.leblanc.cpga@gmail.com'),
)
MANAGERS = ADMINS
# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = '&ufr1l!!bxsd(ijye^o%s#o=k)y%=hcjhm_*8dgg0nht8opkg5'

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = True

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['*', '0.0.0.0', 'localhost', '127.0.0.1', '192.168.0.10', '192.168.0.11', '192.168.0.*']

SITE_ID=2

# Application definition

INSTALLED_APPS = (
	'crispy_forms',
	'dal',
	'dal_select2',
	#'djangocms_admin_style',  # for the admin skin. You **must** add 'djangocms_admin_style' in the list **before** 'django.contrib.admin'
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django_comments',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.sites',
    'django.contrib.gis',
    #'wagtail.wagtailsites',
    'django.contrib.staticfiles',
	'friendship',
	'rest_friendship',
	'rest_framework', 
	'rest_framework.authtoken',
    'rest_auth',
    'allauth',
    'allauth.account',
    'rest_auth.registration',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
	'redis_sessions',	
	'redis_cache',
	
    #'compressor',
    'taggit',
    'modelcluster',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',

    #'wagtail.wagtailcore',
    #'wagtail.wagtailadmin',
    #'wagtail.wagtaildocs',
    #'wagtail.wagtailsnippets',
    #'wagtail.wagtailusers',
    #'wagtail.wagtailimages',
    #'wagtail.wagtailembeds',
    #'wagtail.wagtailsearch',
    #'wagtail.wagtailredirects',
    #'wagtail.wagtailforms',
	#'_420cms',
	'notifications',
	'picture_comments',
	'cicu',
   # 'mailer',
    'feedback_form',
    'django_libs',
	'secretballot',
	'likes',
	'lbc_rest_auth',
	#'el_pagination',
	'hashtags',
	'markdown',
	'django_filters',
	'simplejson',
	'adjacent',
	'search',
	'world',
	'usstates',
	'webpack_loader',
    'channels',
    'rest_flag',
	'chat',
	'api',
    'larb',
)

MIDDLEWARE_CLASSES = (
    #'wagtail.wagtailcore.middleware.SiteMiddleware',
    #'wagtail.wagtailredirects.middleware.RedirectMiddleware',
	'django.middleware.cache.UpdateCacheMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    #'django.middleware.doc.XViewMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
    'likes.middleware.SecretBallotUserIpUseragentMiddleware',
)
AUTHENTICATION_BACKENDS = ( 
	'django.contrib.auth.backends.ModelBackend', 
    'allauth.account.auth_backends.AuthenticationBackend',
)
MIGRATION_MODULES = {
    'friendship': 'friendship.migrations_django',
    'menus': 'menus.migrations_django',
    'allauth.account': 'allauth.account.migrations_django',
    'allauth.account': 'allauth.socialaccount.migrations_django',
}
STATIC_ROOT = os.path.join('420/VirtualEnv/420dev/_420dev', 'static')
STATIC_URL = '/static/'
STATICFILES_DIRS = (
  os.path.join(BASE_DIR, 'static/'),
)
STATICFILES_FINDERS =[
	'django.contrib.staticfiles.finders.FileSystemFinder',
	'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #os.path.join(BASE_DIR, 'assets'), 
]
#CACHES = {
#    'default': {
#        'BACKEND': 'redis_cache.RedisCache',
#        'LOCATION': '/var/run/redis/redis.sock',
#        'TIMEOUT': 0,
#    },
#}
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'djreact/assets/bundles/local/js',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats-local.json'),
    }
}
COMPRESS_PRECOMPILERS = (
    ('text/x-scss', 'django_libsass.SassCompiler'),
)
# channels
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'asgi_redis.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
        'ROUTING': '_420dev.routing.channel_routing',
    },
}

#########
# REDIS #
#########

#SESSION_ENGINE = 'redis_sessions.session' 
#SESSION_REDIS_UNIX_DOMAIN_SOCKET_PATH = '/var/run/redis/redis.sock'

##################
# GEOS & POSTGIS #
##################

#GEOS_LIBRARY_PATH = 'C:/Users/Nick/AppData/Local/Programs/Python/Python36-32/Lib/OSGeo4W/lib/geos_c.lib'
GDAL_LIBRARY_PATH = 'Z:/gdal-2.0.2/gdal200.dll'
GEOIP_PATH = 'Z:/420/VirtualEnv/420dev/_420dev/world/data/geoip2/'

#POSTGIS_VERSION = ( 2, 1 )
########
#CRISPY#
########

CRISPY_TEMPLATE_PACK = 'bootstrap3'

################
#COMMENTS & PAGI#
################

PICTURE_COMMENTS_EXCLUDE_FIELDS = ('name', 'email', 'url')
COMMENTS_APP = 'picture_comments'

#############################
# auth and allauth settings #
#############################
LOGOUT_REDIRECT_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
ACCOUNT_ADAPTER = "larb.adapter.CustomAccountAdapter"
SOCIALACCOUNT_ADAPTER = "lbc_rest_auth.adapter.LBCFacebookAdapter"
ACCOUNT_EMAIL_REQUIRED = True   
ACCOUNT_USERNAME_REQUIRED = True

from allauth.account.app_settings import EmailVerificationMethod

ACCOUNT_EMAIL_VERIFICATION = "none"# TODO: change in production
SOCIALACCOUNT_PROVIDERS = {
    'facebook': {
		'SCOPE': ['email', 'public_profile', 'user_friends'],
        'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
        'INIT_PARAMS': {'cookie': True},
        'FIELDS': [
            'id',
            'email',
            'name',
            'first_name',
            'last_name',
            'verified',
            'locale',
            'timezone',
            'link',
            'gender',
            'updated_time',
        ],
        'EXCHANGE_TOKEN': True,
        'LOCALE_FUNC': lambda request: 'en_US',
        'VERIFIED_EMAIL': False,
        'VERSION': 'v2.5',
    }
}
SOCIALACCOUNT_AUTO_SIGNUP = True
ACCOUNT_SIGNUP_FORM_CLASS = 'larb.forms.SignupForm'
#SOCIALACCOUNT_FORMS ={'signup':'larb.forms.SocialSignupForm'}
AUTH_PROFILE_MODULE = "larb.UserProfile"

########
# REST #
########

NOTIFICATIONS_USE_JSONFIELD=True
REST_FRAMEWORK = {
    # Authenticate with JSON Web Token, TODO: activate SessionAuth in production?
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        #'rest_framework.authentication.TokenAuthentication',
        #'rest_framework.authentication.BasicAuthentication',
        #'rest_framework.authentication.SessionAuthentication',
        ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
        #'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
}

REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'rest_friendship.serializers.UserSerializer',
    'JWT_SERIALIZER': 'lbc_rest_auth.serializers.LBCJWTTokenSerializer',
    'TOKEN_SERIALIZER': 'lbc_rest_auth.serializers.LBCJWTTokenSerializer',
}
REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'lbc_rest_auth.serializers.LBCRegisterSerializer',
}
#REST_AUTH_TOKEN_MODEL='lbc_rest_auth.models.LBCJWTToken'
REFRESH_TOKEN_DAYS = 365 # set to a year, may change
JWT_AUTH = {
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'api.jwt_handler.jwt_response_payload_handler',
    'JWT_AUTH_HEADER_PREFIX': 'JWT',
    'JWT_ALLOW_REFRESH': True,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(seconds=24*60*60*REFRESH_TOKEN_DAYS)
}
REST_SESSION_LOGIN = False
REST_USE_JWT = True
###########
# GENERAL #
###########

ROOT_URLCONF = '_420dev.urls'

WSGI_APPLICATION = '_420dev.wsgi.application'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'n.leblanc.cpga@gmail.com'
EMAIL_HOST_PASSWORD = 'BitchPlz123'
EMAIL_PORT = 587

#FROM_EMAIL='noreply@localhost.com'

######
# DB #
######

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': '_420django_dev',
		'USER': 'postgres',
		'PASSWORD': 'BitchPlz123',
		'HOST': '',
		'PORT': '5432'
    }
}
# Internationalization

LANGUAGES = [
    ('en-us', 'English'),
]
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Los_Angeles'

USE_I18N = True

USE_L10N = True

USE_TZ = True

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

IMAGE_MIME_TYPES = ("image/gif", "image/png", "image/jpeg", ".jpg", ".jpeg", ".png", ".gif")
VIDEO_MIME_TYPES = ("video/mp4", "video/mov", ".mp4", ".mov")

#TEMPLATE_DIRS = (
#    os.path.join(BASE_DIR, 'templates'),
#    '/usr/local/lib/python3.4/site-packages/allauth/templates',
#)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            '/420/VirtualEnv/420dev/_420dev/templates/',
            ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
				'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
