from django.db import connection
from larb.models import Post,UserProfile
from django.contrib.postgres.search import SearchVector
import sys 
import traceback
def raw_posts_query(filter='test'):
    
    query = "SELECT * FROM(SELECT DISTINCT ON(user_post.id) user_post.id,user_post.pub_date,user_post.text,user_post.user_id FROM user_post FULL OUTER JOIN django_comments ON (user_post.id = django_comments.object_pk::integer) WHERE user_post.text LIKE %s OR django_comments.comment LIKE %s)user_post ORDER BY user_post.pub_date DESC"
    posts = Post.objects.raw(query,["%%"+filter+"%%","%%"+filter+"%%"])
    print(posts)
    for p in posts:
        print(p)
    print(len(connection.queries))
def users_search(filter='tset'):
    users = UserProfile.objects.select_related('user').annotate(search=SearchVector('user__username')).filter(
        search=filter)
    print(users)
    print(connection.queries)