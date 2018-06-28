from django.conf.urls import  include, url
from hashtags.models import HashTag
from hashtags.views import hashtag_index, hashtagged_item_list

index_url = url(
    regex  = '^$',
    view   = hashtag_index,
    name   = 'hashtag_index',
)

hashtagged_item_list_url = url(
    regex  = '^(?P<hashtag>[-\w]+)/$',
    view   = hashtagged_item_list,
    name   = 'hashtagged_item_list'
)

urlpatterns = [ 
				url('^$',hashtag_index, name="hashtag_index"),
				url('^(?P<hashtag>[-\w]+)/$' ,hashtagged_item_list)
]