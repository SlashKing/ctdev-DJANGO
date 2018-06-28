"""
>>> print(User.objects.filter(params).select_related('profile').exclude(profile__votes=Vote.objects.filter(Q(content_type_id=ContentType.objects.get_for_model(UserProfile).id) & Q(object_id=1) & Q(token=2))).order_by('profile__location').distinct())
<QuerySet [<User: tesjfglll>, <User: 420dev>, <User: first_test>, <User: twizted_fidget>, <User: twizted_test>, <User: NicholasLeBlanc_>]>
>>> print(User.objects.filter(params).select_related('profile').exclude(profile__votes=Vote.objects.filter(Q(content_type_id=ContentType.objects.get_for_model(UserProfile).id) & Q(object_id=1) & Q(token=2))).order_by('profile__location').distinct().query)
SELECT DISTINCT "auth_user"."id", "auth_user"."password", "auth_user"."last_login", "auth_user"."is_superuser", 
"auth_user"."username", "auth_user"."first_name", "auth_user"."last_name", "auth_user"."email", "auth_user"."is_staff", 
"auth_user"."is_active", "auth_user"."date_joined", "user_profile"."id", "user_profile"."user_id", 
"user_profile"."profile_image_id", "user_profile"."cover_image_id", 
"user_profile"."about_me", "user_profile"."date_of_birth", 
"user_profile"."user_type", "user_profile"."rel_status", 
"user_profile"."gender", "user_profile"."address", "user_profile"."country", "user_profile"."state", "user_profile"."post_code", "user_profile"."website", "user_profile"."company", 
"user_profile"."has_accepted_tos", "user_profile"."is_18_or_older", "user_profile"."is_private", "user_profile"."isApproved", "user_profile"."location", "user_profile"."interested_in", 
"user_profile"."maxdistance" FROM "auth_user" INNER JOIN "user_profile" ON ("auth_user"."id" = "user_profile"."user_id") 
WHERE (ST_DistanceSphere("user_profile"."location", ST_GeomFromEWKB('\001\001\000\000 \346\020\000\000\000\000\000\000\000\000\024@\000\000\000\000\000\0007@'::bytea)) <= 10000000.0 
AND NOT ("user_profile"."id" IN (SELECT V2."object_id" AS Col1 FROM "secretballot_vote" V2 WHERE (V2."id" = (SELECT U0."id" AS Col1 FROM "secretballot_vote" U0 WHERE (U0."content_type_id" = 39 AND U0."object_id" = 1 AND U0."token" = 2)) AND V2."content_type_id" = 39)))) ORDER BY "user_profile"."location" ASC
"""