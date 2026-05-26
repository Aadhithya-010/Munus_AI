from pydantic import BaseModel


class QueryInput(BaseModel):

    query: str
    workspace_id: str
    meeting_id: str