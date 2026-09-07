"""AhadNova AI - FastAPI Application Entry Point."""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import logging

from .config import get_settings
from .routes import health_router, chat_router
from . import __version__

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    settings = get_settings()
    logger.info(f"🚀 Starting AhadNova AI v{__version__}")
    
    if settings.gemini_api_key:
        logger.info("✅ Gemini API key configured")
    else:
        logger.warning("⚠️ GEMINI_API_KEY not set - API calls will fail")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down AhadNova AI")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title="AhadNova AI",
        description="""
        🤖 **AhadNova AI** - Your Intelligent Technical Assistant
        
        Specialized in:
        - 💻 Computer Science fundamentals
        - 🛡️ Cybersecurity topics
        - ⚙️ Engineering concepts
        - 📝 Technical interview preparation
        
        ## Features
        
        - **Chat**: Engage in technical conversations
        - **Image Analysis**: Upload diagrams, code screenshots, or error messages
        - **Quiz Mode**: Test your cybersecurity knowledge
        - **Multiple Modes**: Normal, ELI5, and Expert explanations
        - **Streaming**: Real-time response streaming
        
        ## Authentication
        
        No authentication required! Start chatting immediately.
        """,
        version=__version__,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan
    )
    
    # Rate limiting
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Exception handlers
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected error occurred. Please try again."}
        )
    
    # Include routers
    app.include_router(health_router)
    app.include_router(chat_router)
    
    # Root endpoint
    @app.get("/", tags=["Root"])
    async def root():
        """Welcome endpoint with API information."""
        return {
            "name": "AhadNova AI",
            "version": __version__,
            "description": "Intelligent Technical Assistant for Engineering, CS & Cybersecurity",
            "documentation": "/docs",
            "health": "/health"
        }
    
    return app


# Create app instance
app = create_app()
