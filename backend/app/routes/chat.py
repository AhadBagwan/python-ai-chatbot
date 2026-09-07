"""Chat routes for AhadNova AI."""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from typing import Optional
import json
import asyncio

from ..models.schemas import (
    ChatRequest, 
    ChatResponse, 
    ImageAnalysisRequest,
    ImageAnalysisResponse,
    QuizRequest,
    QuizResponse,
    QuizQuestion,
    AuditRequest,
    AuditResponse,
    AuditVulnerability,
    LogAuditRequest,
    LogAuditResponse,
    LogAnomalyItem,
    DevOpsAuditRequest,
    DevOpsAuditResponse,
    DevOpsIssueItem,
    NmapRequest,
    NmapResponse,
    NmapFlagItem,
    AIModel,
    ExplainMode
)
from ..services.gemini_service import gemini_service
from ..services.image_service import image_service

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/analyze-log", response_model=LogAuditResponse)
async def analyze_log(request: LogAuditRequest):
    """Analyze server / firewall logs for security anomalies and intrusion patterns."""
    try:
        result = await gemini_service.analyze_log(
            log_content=request.log_content,
            log_type=request.log_type
        )
        
        anomalies = [
            LogAnomalyItem(
                type=item.get("type", "Log Anomaly"),
                severity=item.get("severity", "MEDIUM"),
                source_ip=item.get("source_ip"),
                count=item.get("count"),
                details=item.get("details", ""),
                remediation=item.get("remediation", "")
            )
            for item in result.get("anomalies", [])
        ]
        
        return LogAuditResponse(
            summary=result.get("summary", "Log analysis complete."),
            threat_level=result.get("threat_level", "LOW"),
            threat_score=result.get("threat_score", 0),
            anomalies=anomalies,
            top_ips=result.get("top_ips", []),
            recommendations=result.get("recommendations", []),
            processing_time=result.get("processing_time", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Log audit error: {str(e)}")


@router.post("/audit-devops", response_model=DevOpsAuditResponse)
async def audit_devops(request: DevOpsAuditRequest):
    """Audit Dockerfile or Kubernetes YAML manifests for container security compliance."""
    try:
        result = await gemini_service.audit_devops(
            manifest_content=request.manifest_content,
            file_type=request.file_type
        )
        
        security_issues = [
            DevOpsIssueItem(
                cwe=issue.get("cwe", "CWE-250"),
                title=issue.get("title", "DevOps Security Issue"),
                severity=issue.get("severity", "MEDIUM"),
                rule=issue.get("rule", "Security Best Practice"),
                description=issue.get("description", ""),
                fix=issue.get("fix", "")
            )
            for issue in result.get("security_issues", [])
        ]
        
        return DevOpsAuditResponse(
            summary=result.get("summary", "DevOps audit completed."),
            compliance_score=result.get("compliance_score", 100),
            security_issues=security_issues,
            remediated_manifest=result.get("remediated_manifest", request.manifest_content),
            processing_time=result.get("processing_time", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DevOps audit error: {str(e)}")


@router.post("/generate-nmap", response_model=NmapResponse)
async def generate_nmap(request: NmapRequest):
    """Generate optimized Nmap syntax with flag breakdown and safety guidance."""
    try:
        result = await gemini_service.generate_nmap(
            target=request.target,
            scan_type=request.scan_type,
            custom_ports=request.custom_ports
        )
        
        breakdown = [
            NmapFlagItem(flag=b.get("flag", ""), meaning=b.get("meaning", ""))
            for b in result.get("breakdown", [])
        ]
        
        return NmapResponse(
            command=result.get("command", f"nmap {request.target}"),
            explanation=result.get("explanation", "Nmap scan command."),
            breakdown=breakdown,
            safety_note=result.get("safety_note", "Ensure authorization."),
            processing_time=result.get("processing_time", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Nmap generator error: {str(e)}")



@router.post("/audit", response_model=AuditResponse)
async def audit_code(request: AuditRequest):
    """
    Perform a static security code audit on a code snippet.
    
    - **code**: Code snippet to scan
    - **language**: Programming language or framework
    """
    try:
        result = await gemini_service.audit_code(
            code=request.code,
            language=request.language
        )
        
        vulnerabilities = [
            AuditVulnerability(
                cwe=v.get("cwe", "CWE-Unknown"),
                title=v.get("title", "Security Issue"),
                severity=v.get("severity", "MEDIUM"),
                line_number=v.get("line_number"),
                description=v.get("description", ""),
                remediation=v.get("remediation", "")
            )
            for v in result.get("vulnerabilities", [])
        ]
        
        return AuditResponse(
            summary=result.get("summary", "Audit completed."),
            risk_score=result.get("risk_score", 0),
            vulnerabilities=vulnerabilities,
            patched_code=result.get("patched_code", request.code),
            processing_time=result.get("processing_time", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code audit error: {str(e)}")


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to AhadNova AI and get a response.
    
    - **message**: The user's message/question
    - **conversation_history**: Previous messages for context (optional)
    - **model**: AI model to use (gemini-1.5-flash or gemini-1.5-pro)
    - **explain_mode**: Response complexity (normal, eli5, expert)
    - **stream**: Enable streaming response (use /chat/stream endpoint instead)
    """
    try:
        response_text, tokens_used, processing_time = await gemini_service.generate_response(
            message=request.message,
            history=request.conversation_history,
            model_name=request.model.value,
            explain_mode=request.explain_mode
        )
        
        return ChatResponse(
            response=response_text,
            model=request.model.value,
            tokens_used=tokens_used,
            processing_time=round(processing_time, 3)
        )
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    Stream a response from AhadNova AI.
    
    Returns Server-Sent Events (SSE) with response chunks.
    """
    async def generate():
        full_text = ""
        try:
            async for chunk in gemini_service.generate_stream(
                message=request.message,
                history=request.conversation_history,
                model_name=request.model.value,
                explain_mode=request.explain_mode
            ):
                full_text += chunk
                # SSE format - send cumulative text
                yield f"data: {json.dumps({'content': full_text})}\n\n"
                await asyncio.sleep(0)  # Allow other tasks to run
            
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    prompt: str = Form(default="Analyze this image and explain what you see."),
    model: str = Form(default="gemini-1.5-flash")
):
    """
    Upload an image for AI analysis.
    
    Supported formats: JPEG, PNG, GIF, WebP
    Max size: 10MB
    
    Use cases:
    - Analyze code screenshots
    - Explain diagrams/flowcharts
    - Debug error screenshots
    - Understand architecture diagrams
    """
    # Validate image
    valid, error = image_service.validate_image(file.content_type, file.size or 0)
    if not valid:
        raise HTTPException(status_code=400, detail=error)
    
    try:
        # Read and process image
        image_data = await file.read()
        processed_image = image_service.process_image(image_data)
        
        # Analyze with Gemini
        analysis, processing_time = await gemini_service.analyze_image(
            image_data=processed_image,
            prompt=prompt,
            model_name=model
        )
        
        return ImageAnalysisResponse(
            analysis=analysis,
            model=model,
            processing_time=round(processing_time, 3)
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis error: {str(e)}")


@router.post("/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """
    Generate a cybersecurity/technical quiz.
    
    - **topic**: Quiz topic (e.g., "SQL Injection", "XSS", "Buffer Overflow")
    - **difficulty**: easy, medium, or hard
    - **num_questions**: Number of questions (1-10)
    """
    try:
        questions = await gemini_service.generate_quiz(
            topic=request.topic,
            difficulty=request.difficulty,
            num_questions=request.num_questions
        )
        
        if not questions:
            raise HTTPException(status_code=500, detail="Failed to generate quiz questions")
        
        # Convert to QuizQuestion models
        quiz_questions = [
            QuizQuestion(
                question=q["question"],
                options=q["options"],
                correct_answer=q["correct_answer"],
                explanation=q["explanation"],
                difficulty=q.get("difficulty", request.difficulty),
                category=q.get("category", request.topic)
            )
            for q in questions
        ]
        
        return QuizResponse(
            topic=request.topic,
            questions=quiz_questions
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation error: {str(e)}")


@router.get("/models")
async def list_models():
    """List available AI models."""
    return {
        "models": [
            {
                "id": "gemini-1.5-flash",
                "name": "Gemini 1.5 Flash",
                "description": "Fast, efficient model for most tasks",
                "recommended": True
            },
            {
                "id": "gemini-1.5-pro",
                "name": "Gemini 1.5 Pro",
                "description": "Most capable model for complex tasks",
                "recommended": False
            }
        ]
    }


@router.get("/modes")
async def list_modes():
    """List available explanation modes."""
    return {
        "modes": [
            {
                "id": "normal",
                "name": "Normal",
                "description": "Balanced explanations for general audience",
                "icon": "📚"
            },
            {
                "id": "eli5",
                "name": "Explain Like I'm 5",
                "description": "Simple explanations with analogies",
                "icon": "🧒"
            },
            {
                "id": "expert",
                "name": "Expert Mode",
                "description": "In-depth technical explanations",
                "icon": "🎓"
            }
        ]
    }
