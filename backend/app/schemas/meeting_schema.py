from pydantic import BaseModel
from typing import Optional


class MeetingInput(BaseModel):
    title: str
    transcript: str
    workspace_id: Optional[str] = "default_workspace"
