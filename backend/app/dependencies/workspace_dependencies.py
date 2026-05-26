from fastapi import HTTPException

from app.core.logger import logger

from app.services.mongo_service import get_workspace


def validate_workspace_access(

    workspace_id: str,

    current_user
):

    try:

        logger.info(f"Workspace validation started: {workspace_id}")

        workspace = get_workspace(workspace_id)

        if not workspace:

            logger.warning(f"Workspace not found: {workspace_id}")

            raise HTTPException(

                status_code=404,

                detail="Workspace not found"
            )


        if current_user["email"] not in workspace["members"]:

            logger.warning(f"Unauthorized workspace access attempt: {workspace_id}")

            raise HTTPException(

                status_code=403,

                detail="Workspace access denied"
            )


        logger.info(f"Workspace access granted: {workspace_id}")

        return workspace


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during workspace validation: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Workspace validation failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Workspace validation failed"
        )