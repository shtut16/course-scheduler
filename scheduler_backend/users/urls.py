from django.urls import path, include
from .views import (
    CustomTokenObtainPairView, DashboardView, signup,
    EventCreateView, event_detail,
    MyCalendarView, SharedCalendarView,
    PushCalendarToSharedView, recent_changes, api_home
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'my-calendar', MyCalendarView, basename='my-calendar')
router.register(r'shared-calendar', SharedCalendarView, basename='shared-calendar')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('signup/', signup, name='signup'),
    path('events/', EventCreateView.as_view(), name='create-event'),
    path('events/<int:id>/', event_detail, name='event-detail'),
    path('push-to-shared/', PushCalendarToSharedView.as_view(), name='push-to-shared'),
    path('recent-changes/', recent_changes, name='recent-changes'),
    path('', api_home, name='api_home'),  # ← move this to the bottom
]
