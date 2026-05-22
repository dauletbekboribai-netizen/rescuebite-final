from sqlmodel import Session

from app.models.domain import EmailJob
from app.workers.email_worker import send_email_task


def enqueue_email(
    session: Session,
    to_email: str,
    subject: str,
    html: str,
):
    job = EmailJob(
        to_email=to_email,
        subject=subject,
        html=html,
        status="pending",
        retries=0,
    )

    session.add(job)
    session.commit()
    session.refresh(job)

    send_email_task.delay(
        job.id,
        to_email,
        subject,
        html,
    )