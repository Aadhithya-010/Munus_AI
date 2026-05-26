from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.logger import logger

from app.schemas.user_schema import UserRegister

from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)

from app.services.mongo_service import (
    create_user,
    get_user_by_email
)


router = APIRouter(

    prefix="/api/v1/auth",

    tags=["Authentication"]
)


@router.post("/register")
async def register_user(
    payload: UserRegister
):

    try:

        logger.info(f"Registration attempt: {payload.email}")


        existing_user = get_user_by_email(payload.email)
        


        if existing_user:

            logger.warning(f"Duplicate registration attempt: {payload.email}")

            raise HTTPException(

                status_code=400,

                detail="User already exists"
            )


        hashed_password = hash_password(payload.password)
        


        user_data = {

            "email": payload.email,

            "hashed_password": hashed_password
        }


        created_user = create_user(user_data)
        


        logger.info(f"User registered: {payload.email}")


        return {

            "success": True,

            "user": {

                "email": created_user["email"]
            }
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during registration: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected registration failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Registration failed"
        )



@router.post("/login")
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    try:

        logger.info(f"Login attempt: {form_data.username}")


        user = get_user_by_email(form_data.username)


        if not user:

            logger.warning(f"Login failed - user not found: {form_data.username}")

            raise HTTPException(

                status_code=401,

                detail="Invalid credentials"
            )


        valid_password = verify_password(

            form_data.password,

            user["hashed_password"]
        )


        if not valid_password:

            logger.warning(f"Invalid password attempt: {form_data.username}")

            raise HTTPException(

                status_code=401,

                detail="Invalid credentials"
            )


        token = create_access_token({

            "sub": user["email"]
        })


        logger.info(f"User logged in: {form_data.username}")


        return {
            "access_token": token,
            "token_type": "bearer"
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during login: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected login failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Login failed"
        )