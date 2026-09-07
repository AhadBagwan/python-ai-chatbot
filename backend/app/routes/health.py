"""Health check routes for AhadNova AI."""
from fastapi import APIRouter
from ..models.schemas import HealthResponse
from ..config import get_settings
from .. import __version__

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
async def health_check():
    """Check API health status."""
    settings = get_settings()
    
    return HealthResponse(
        status="healthy",
        version=__version__,
        gemini_configured=bool(settings.gemini_api_key)
    )


@router.get("/ready")
async def readiness_check():
    """Check if API is ready to serve requests."""
    settings = get_settings()
    
    if not settings.gemini_api_key:
        return {"ready": False, "reason": "GEMINI_API_KEY not configured"}
    
    return {"ready": True}
