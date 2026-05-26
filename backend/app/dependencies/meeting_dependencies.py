from fastapi import HTTPException

from app.core.logger import logger

from app.services.mongo_service import (
    get_meeting
)



async def validate_meeting_access(

    meeting_id: str,

    current_user
):

    try:

        logger.info(f"Meeting access validation started: {meeting_id}")


        meeting = get_meeting(
            meeting_id
        )


        if not meeting:

            logger.warning(f"Meeting not found: {meeting_id}")

            raise HTTPException(

                status_code=404,

                detail="Meeting not found"
            )


        if meeting["created_by"] != current_user["email"]:

            logger.warning(f"Unauthorized meeting access attempt: {meeting_id}")

            raise HTTPException(

                status_code=403,

                detail="Access denied"
            )


        logger.info(f"Meeting access granted: {meeting_id}")


        return meeting


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during meeting validation: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected meeting validation failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Meeting validation failed"
        )
