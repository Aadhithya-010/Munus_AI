from fastapi import APIRouter, Depends, HTTPException

from app.core.logger import logger

from app.dependencies.auth_dependencies import get_current_user
from app.dependencies.meeting_dependencies import validate_meeting_access
from app.dependencies.workspace_dependencies import validate_workspace_access

from app.schemas.chat_schema import QueryInput

from app.agents.query_agent import query_meetings


router = APIRouter(
    prefix="/api/v1/chat",
    tags=["Semantic Query"]
)


@router.post("/query")
async def semantic_query(

    payload: QueryInput,

    current_user = Depends( get_current_user)

):

    try:

        logger.info(f"Semantic query request received for meeting: {payload.meeting_id}")


        await validate_meeting_access(

            payload.meeting_id,

            current_user
        )

        validate_workspace_access(

             payload.workspace_id,

             current_user
        )


        logger.info(f"Meeting access validated for: {payload.meeting_id}")


        result = await query_meetings(

            payload.query,

            payload.workspace_id,

            payload.meeting_id
        )


        logger.info(f"Semantic query completed for meeting: {payload.meeting_id}")


        return {

            "success": True,

            "message": "Query processed successfully",

            "data": result
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during semantic query route: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected semantic query route failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Semantic query failed"
        )