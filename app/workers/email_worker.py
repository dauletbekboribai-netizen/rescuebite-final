import smtplib
from datetime import datetime, timezone
from email.mime.text import MIMEText

from celery import Celery
from sqlmodel import Session

from app.core.config import get_settings
from app.database import engine
from app.models.domain import EmailJob

settings = get_settings()

celery_app = Celery(
    "rescuebite",
    broker=settings.redis_url,
    backend=settings.redis_url,
)


@celery_app.task(bind=True, max_retries=3)
def send_email_task(self, job_id: int, to_email: str, subject: str, html: str):
    with Session(engine) as session:
        job = session.get(EmailJob, job_id)

        try:
            msg = MIMEText(html, "html")
            msg["Subject"] = subject
            msg["From"] = settings.email_from
            msg["To"] = to_email

            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.starttls()
                server.login(settings.smtp_user, settings.smtp_password)
                server.send_message(msg)

            if job:
                job.status = "sent"
                job.sent_at = datetime.now(timezone.utc)
                session.add(job)
                session.commit()

        except Exception as exc:
            if job:
                job.status = "failed"
                job.retries += 1
                job.error = str(exc)[:1000]
                session.add(job)
                session.commit()

            raise self.retry(exc=exc, countdown=60)