from fastapi import APIRouter, HTTPException

from app.core.logger import logger


router = APIRouter(
    prefix="/api/v1/health",
    tags=["Health"]
)


@router.get("/")
async def health_check():

    try:

        logger.info("Health check endpoint accessed")


        return {

            "success": True,

            "message": "MUNUS AI backend running",

            "data": {}
        }


    except Exception as e:

        logger.error(f"Health check failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Health check failed"
        )