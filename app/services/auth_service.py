from datetime import datetime, timedelta

from fastapi import HTTPException

from jose import JWTError, jwt

from passlib.context import CryptContext

from app.core.config import SECRET_KEY
from app.core.logger import logger



ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 120


pwd_context = CryptContext(

    schemes=["bcrypt"],

    deprecated="auto"
)



def hash_password(password: str):

    try:

        logger.info("Password hashing started")

        hashed_password = pwd_context.hash(password)
        

        logger.info("Password hashing completed")

        return hashed_password


    except Exception as e:

        logger.error(f"Password hashing failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Password hashing failed"
        )



def verify_password(

    plain_password: str,

    hashed_password: str
):

    try:

        logger.info("Password verification started")

        is_valid = pwd_context.verify(

            plain_password,

            hashed_password
        )

        logger.info("Password verification completed")

        return is_valid


    except Exception as e:

        logger.error(f"Password verification failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Password verification failed"
        )



def create_access_token(data: dict):

    try:

        logger.info("JWT token generation started")


        to_encode = data.copy()


        expire = datetime.utcnow() + timedelta(

            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )


        to_encode.update({ "exp": expire})


        encoded_jwt = jwt.encode(

            to_encode,

            SECRET_KEY,

            algorithm=ALGORITHM
        )


        logger.info("JWT token generated successfully")


        return encoded_jwt


    except Exception as e:

        logger.error(f"JWT token generation failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Token generation failed"
        )



def verify_access_token(
    token: str
):

    try:

        logger.info("JWT token verification started")


        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]
        )


        email = payload.get("sub")


        if email is None:

            logger.warning("JWT token missing subject/email")

            return None


        logger.info(f"JWT token verified successfully: {email}")


        return email


    except JWTError as e:

        logger.error(f"JWT verification failed: {str(e)}")

        return None


    except Exception as e:

        logger.error(f"Unexpected JWT verification failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Token verification failed"
        )