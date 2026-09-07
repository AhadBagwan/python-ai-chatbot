"""Pydantic schemas for request/response models."""
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    """Role of message sender."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class AIModel(str, Enum):
    """Available AI models."""
    GEMINI_FLASH = "gemini-1.5-flash"
    GEMINI_PRO = "gemini-1.5-pro"
    GEMINI_2_FLASH = "gemini-2.0-flash"
    GEMINI_2_PRO = "gemini-2.0-pro"


class ExplainMode(str, Enum):
    """Explanation complexity modes."""
    NORMAL = "normal"
    ELI5 = "eli5"
    EXPERT = "expert"


class ChatMessage(BaseModel):
    """Single chat message."""
    role: MessageRole
    content: str
    timestamp: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "user",
                "content": "Explain SQL injection",
                "timestamp": "2024-01-01T12:00:00"
            }
        }


class ChatRequest(BaseModel):
    """Chat request payload."""
    message: str = Field(..., min_length=1, max_length=10000, description="User message")
    conversation_history: Optional[List[ChatMessage]] = Field(default=[], description="Previous messages for context")
    model: AIModel = Field(default=AIModel.GEMINI_FLASH, description="AI model to use")
    explain_mode: ExplainMode = Field(default=ExplainMode.NORMAL, description="Explanation complexity")
    stream: bool = Field(default=False, description="Enable streaming response")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "What is a buffer overflow attack?",
                "model": "gemini-1.5-flash",
                "explain_mode": "normal",
                "stream": False
            }
        }


class ChatResponse(BaseModel):
    """Chat response payload."""
    response: str = Field(..., description="AI generated response")
    model: str = Field(..., description="Model used for generation")
    tokens_used: Optional[int] = Field(default=None, description="Tokens consumed")
    processing_time: float = Field(..., description="Time taken in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "SQL injection is a code injection technique...",
                "model": "gemini-1.5-flash",
                "tokens_used": 256,
                "processing_time": 1.23
            }
        }


class ImageAnalysisRequest(BaseModel):
    """Image analysis request."""
    prompt: str = Field(default="Analyze this image and explain what you see.", description="Analysis prompt")
    model: AIModel = Field(default=AIModel.GEMINI_FLASH, description="AI model to use")


class ImageAnalysisResponse(BaseModel):
    """Image analysis response."""
    analysis: str = Field(..., description="AI analysis of the image")
    model: str = Field(..., description="Model used")
    processing_time: float = Field(..., description="Time taken in seconds")


class QuizQuestion(BaseModel):
    """Cybersecurity quiz question."""
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    difficulty: Literal["easy", "medium", "hard"]
    category: str


class QuizRequest(BaseModel):
    """Quiz generation request."""
    topic: str = Field(..., description="Quiz topic (e.g., 'SQL Injection', 'XSS')")
    difficulty: Literal["easy", "medium", "hard"] = Field(default="medium")
    num_questions: int = Field(default=5, ge=1, le=10)


class QuizResponse(BaseModel):
    """Quiz response with questions."""
    topic: str
    questions: List[QuizQuestion]


class AuditVulnerability(BaseModel):
    """Vulnerability item found during code audit."""
    cwe: str = Field(..., description="CWE ID or category (e.g. CWE-89)")
    title: str = Field(..., description="Short vulnerability title")
    severity: Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"] = Field(..., description="Severity level")
    line_number: Optional[int] = Field(default=None, description="Line number where issue was found")
    description: str = Field(..., description="Explanation of the vulnerability")
    remediation: str = Field(..., description="How to fix the issue")


class AuditRequest(BaseModel):
    """Code security audit request."""
    code: str = Field(..., min_length=5, description="Code snippet to audit")
    language: str = Field(default="python", description="Programming language or format")


class AuditResponse(BaseModel):
    """Code security audit response."""
    summary: str = Field(..., description="Executive summary of the security audit")
    risk_score: int = Field(..., ge=0, le=100, description="Overall risk score 0-100")
    vulnerabilities: List[AuditVulnerability] = Field(default=[], description="Discovered security issues")
    patched_code: str = Field(..., description="Clean, remediated code snippet")
    processing_time: float = Field(..., description="Processing time in seconds")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    gemini_configured: bool

