from fastapi import Depends, HTTPException

from fastapi.security import OAuth2PasswordBearer

from app.core.logger import logger

from app.services.auth_service import ( verify_access_token)

from app.services.mongo_service import ( get_user_by_email)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")



async def get_current_user(

    token: str = Depends( oauth2_scheme)
):

    try:

        logger.info("User authentication started")


        email = verify_access_token(token)
            
        


        if not email:

            logger.warning("Invalid or expired token detected")

            raise HTTPException(

                status_code=401,

                detail="Invalid or expired token"
            )


        user = get_user_by_email(email)
        


        if not user:

            logger.warning(f"Authenticated user not found: {email}")

            raise HTTPException(

                status_code=401,

                detail="User not found"
            )


        logger.info(f"User authenticated successfully: {email}")

        return user


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during authentication: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected authentication failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Authentication failed"
        )