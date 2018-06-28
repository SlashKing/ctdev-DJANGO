from django.http import HttpResponse, HttpResponseBadRequest
try:
    from django.utils import simplejson
except:
    import simplejson
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.core.files import File
from PIL import Image
from os import path, sep, makedirs
from .forms import UploadedFileForm
from .models import UploadedFile
from .settings import IMAGE_CROPPED_UPLOAD_TO
from django.conf import settings
from decimal import *
import base64
from django.core.files.base import ContentFile
#from restframework.response import Response

@csrf_exempt
@require_POST
def upload(request):
	test = []
	for key, value in request.POST.items():
		test.append( "%s" % (key))
	ext, imgData = test[0].split(';base64,')
	ext = test[0].split("\/")
	return HttpResponse(ext)
	imgData = base64.b64decode((test[0][9:]+"==").replace(' ', '+'))
	with open("imageToSave.png", "wb") as fh:
		fh.write(imgData)
	with open("imageToSave.png", "r",encoding="ansi") as fh2:
		return HttpResponse(fh2)
		
	
	try:
		uploaded_file = UploadedFile.objects.create(file=ContentFile.objects.create())
	except:
		return HttpResponseBadRequest(simplejson.dumps({'errors': {'wtf': 'something went wrong'}}))
	
	
	uploaded_file.user = request.user
	uploaded_file.save()
	# pick an image file you have in the working directory
	# (or give full path name)
	img = Image.open(uploaded_file.file.path, mode='r')
	# get the image's width and height in pixels
	width, height = img.size
	img.close()
	data = {
		'path': uploaded_file.file.url,
		'id' : uploaded_file.id,
		'width' : width,
		'height' : height,
	}
	return HttpResponse(simplejson.dumps("finished"))

@csrf_exempt
@require_POST
def crop(request):
    try:
        if request.method == 'POST':
            box = request.POST.get('cropping', None)
            imageId = request.POST.get('id', None)
            uploaded_file = UploadedFile.objects.get(id=imageId)
            img = Image.open( uploaded_file.file.path, mode='r' )
            values = [Decimal(x) for x in box.split(',')]
            max_size = 600
            width = abs(values[2] - values[0])
            height = abs(values[3] - values[1])
            if width > max_size or height > max_size:
               
                if width > height:    
                    wpercent = (max_size / width)
                    hsize = Decimal((float(height) * float(wpercent)))
                    croppedImage = img.crop(values).resize((max_size, hsize), Image.ANTIALIAS)
                else:
                    hpercent = (max_size / height)
                    wsize = Decimal((float(width) * float(hpercent)))
                    croppedImage = img.crop(values).resize((wsize, max_size), Image.ANTIALIAS)
            else:    
                croppedImage = img.crop(values).resize((width,height),Image.ANTIALIAS)
            pathToFile = path.dirname(uploaded_file.file.path)
            if not path.exists(pathToFile):
                makedirs(pathToFile)
            pathToFile = path.join(pathToFile, path.basename(uploaded_file.file.path))
            croppedImage.save(pathToFile)
            #new_file = UploadedFile()
            f = open(pathToFile, mode='rb')
            uploaded_file.file.save(path.basename(uploaded_file.file.path), File(f))
            f.close()
            #uploaded_file.delete()
            data = {
                'path': uploaded_file.file.url,
                'id' : uploaded_file.id,
            }

            return HttpResponse(simplejson.dumps(data))
    except:
        return HttpResponseBadRequest("oops")