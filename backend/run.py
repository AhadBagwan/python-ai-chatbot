"""Run the AhadNova AI backend server."""
import uvicorn
from app.config import get_settings


def main():
    """Run the server."""
    settings = get_settings()
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )


if __name__ == "__main__":
    main()
