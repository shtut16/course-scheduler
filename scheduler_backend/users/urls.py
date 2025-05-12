from django.urls import path, include
from .views import (
    CustomTokenObtainPairView, DashboardView, signup,
    EventCreateView, event_detail,
    MyCalendarView, SharedCalendarView,
    PushCalendarToSharedView, recent_changes, api_home
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter

# Register viewsets with the router for automatic URL routing
router = DefaultRouter()
router.register(r'my-calendar', MyCalendarView, basename='my-calendar')  # Routes for personal calendar API
router.register(r'shared-calendar', SharedCalendarView, basename='shared-calendar')  # Routes for shared calendar API

urlpatterns = [
    path('', include(router.urls)),  # Include router-generated URLs
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT login endpoint
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT token refresh endpoint
    path('dashboard/', DashboardView.as_view(), name='dashboard'),  # User Dashboard
    path('signup/', signup, name='signup'),  # User Sign up
    path('events/', EventCreateView.as_view(), name='create-event'),  # Create new event
    path('events/<int:id>/', event_detail, name='event-detail'),  # Retrieve, update, delete specific event
    path('push-to-shared/', PushCalendarToSharedView.as_view(), name='push-to-shared'),  # Push personal events
    path('recent-changes/', recent_changes, name='recent-changes'),  # View recent event changes
    path('', api_home, name='api_home'),  # Root API landing page
]
