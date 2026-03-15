from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.v1.auth import get_current_user
from app.models.dengue import User, Notification, DiagnosisReport
from pydantic import BaseModel
from datetime import datetime, timezone

router = APIRouter()

class ActionRequest(BaseModel):
    action_type: str # e.g. "share", "download"
    report_id: str | None = None

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    is_read: bool
    related_id: str | None
    created_at: datetime

@router.post("/action")
async def record_action(data: ActionRequest, current_user: User = Depends(get_current_user)):
    if not current_user.notifications_enabled:
        return {"status": "disabled"}
        
    title = ""
    message = ""
    notif_type = "info"
    
    if data.action_type == "share":
        title = "Report Shared"
        message = "You have successfully shared your health report."
        notif_type = "share"
    elif data.action_type == "download":
        title = "Report Downloaded"
        message = "Your health report has been downloaded as a PDF."
        notif_type = "download"
    else:
        return {"status": "ignored"}

    notification = Notification(
        user_id=str(current_user.id),
        title=title,
        message=message,
        type=notif_type,
        related_id=data.report_id
    )
    await notification.insert()
    return {"status": "success", "id": str(notification.id)}

@router.post("/sync-reminders")
async def sync_reminders(current_user: User = Depends(get_current_user)):
    if not current_user.notifications_enabled:
        return {"status": "disabled"}
        
    # Check if a reminder was already sent today
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    existing = await Notification.find_one(
        Notification.user_id == str(current_user.id),
        Notification.title == "Daily Health Check",
        Notification.created_at >= today_start
    )
    
    if existing:
        return {"status": "already_sent"}
        
    # Get last diagnosis
    last_report = await DiagnosisReport.find_one(
        DiagnosisReport.user_id == str(current_user.id)
    ).sort("-created_at")
    
    message = "Time for your daily health check! Regular monitoring is key to early detection."
    notif_type = "info"
    
    if last_report:
        risk = last_report.kbs_recommendation.get("risk_classification", "Low")
        if risk in ["High", "Critical"]:
            message = "Reminder: Please continue monitoring your symptoms closely due to your recent high risk status."
            notif_type = "alert"
            
    reminder = Notification(
        user_id=str(current_user.id),
        title="Daily Health Check",
        message=message,
        type=notif_type
    )
    await reminder.insert()
    
    return {"status": "created", "notification": str(reminder.id)}

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(current_user: User = Depends(get_current_user)):
    notifications = await Notification.find(
        Notification.user_id == str(current_user.id)
    ).sort("-created_at").limit(50).to_list()
    
    return [
        NotificationResponse(
            id=n.id if isinstance(n.id, str) else str(n.id),
            title=n.title,
            message=n.message,
            type=n.type,
            is_read=n.is_read,
            related_id=n.related_id,
            created_at=n.created_at
        ) for n in notifications
    ]

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: str, current_user: User = Depends(get_current_user)):
    notification = await Notification.get(notification_id)
    if not notification or notification.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    await notification.save()
    return {"status": "success"}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str, current_user: User = Depends(get_current_user)):
    notification = await Notification.get(notification_id)
    if not notification or notification.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Notification not found")
    
    await notification.delete()
    return {"status": "success"}
