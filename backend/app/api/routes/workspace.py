import uuid

from fastapi import APIRouter, Depends, HTTPException

from app.core.logger import logger

from app.dependencies.auth_dependencies import get_current_user

from app.services.mongo_service import (
    create_workspace,
    get_user_workspaces
)


router = APIRouter(

    prefix="/api/v1/workspaces",

    tags=["Workspaces"]
)



@router.post("/")
async def create_new_workspace(

    name: str,

    current_user = Depends(get_current_user)
):

    try:

        logger.info(f"Workspace creation request started by {current_user['email']}")


        workspace_id = str(uuid.uuid4())


        workspace_data = {

            "workspace_id": workspace_id,

            "name": name,

            "created_by": current_user["email"],

            "members": [

                current_user["email"]
            ]
        }


        created_workspace = create_workspace(workspace_data)


        logger.info(f"Workspace created successfully: {workspace_id}")


        return {

            "success": True,

            "data": created_workspace
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during workspace creation: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Workspace creation failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Workspace creation failed"
        )
    
@router.get("/")
async def get_workspaces(current_user = Depends(get_current_user)):

    try:

        logger.info(f"Workspace retrieval started for {current_user['email']}")


        workspaces = get_user_workspaces(current_user["email"])


        logger.info(f"Workspace retrieval completed for {current_user['email']}")


        return {

            "success": True,

            "count": len(workspaces),

            "data": workspaces
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during workspace retrieval: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Workspace retrieval failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Workspace retrieval failed"
        )