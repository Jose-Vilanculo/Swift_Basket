import os
from django.apps import AppConfig
from .functions.tweet import Tweet


class OnlineStoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'online_store'

    def ready(self):
        if os.environ.get('RUN_MAIN') == 'true':  # Only true in actual startup
            Tweet()
