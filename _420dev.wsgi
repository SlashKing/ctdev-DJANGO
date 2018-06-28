import sys
import site
import os

vepath = 'Z:/420/VirtualEnv/420dev/Lib/site-packages'
prev_sys_path = list(sys.path)
site.addsitedir(vepath)
sys.path.append('Z:/420/VirtualEnv/420dev/')
new_sys_path = [p for p in sys.path if p not in prev_sys_path]
for item in new_sys_path:
    sys.path.remove(item)
sys.path[:0] = new_sys_path
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

