from fastapi import HTTPException

from sentence_transformers import SentenceTransformer

from app.core.logger import logger


model = SentenceTransformer("all-MiniLM-L6-v2")

def generate_embedding(text: str):

    try:

        logger.info("Embedding generation started")

        if not text or not text.strip():

            logger.error("Empty text received for embedding generation")

            raise HTTPException(

                status_code=400,

                detail="Text cannot be empty"
            )


        embedding = model.encode(text)


        logger.info("Embedding generation completed")


        return embedding.tolist()


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during embedding generation: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Embedding generation failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Embedding generation failed"
        )