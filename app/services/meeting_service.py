from datetime import datetime

from fastapi import HTTPException

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import CHUNK_SIZE, CHUNK_OVERLAP
from app.core.logger import logger



text_splitter = RecursiveCharacterTextSplitter(

    chunk_size=CHUNK_SIZE,

    chunk_overlap=CHUNK_OVERLAP
)



def split_transcript(
    transcript: str
):

    try:

        logger.info("Transcript chunking started")


        if not transcript or not transcript.strip():

            logger.error("Empty transcript received for chunking")

            raise HTTPException(

                status_code=400,

                detail="Transcript cannot be empty"
            )


        chunks = text_splitter.split_text(transcript)
        


        logger.info(f"Transcript chunking completed with {len(chunks)} chunks")


        return chunks


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during transcript chunking: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Transcript chunking failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Transcript chunking failed"
        )



def build_meeting_document(

    meeting_id: str,

    title: str,

    transcript: str,

    summary: str,

    tasks,

    workspace_id: str,

    created_by: str
):

    try:

        logger.info(f"Meeting document build started: {meeting_id}")


        meeting_document = {

            # CORE IDs
            "meeting_id": meeting_id,

            "workspace_id": workspace_id,

            "created_by": created_by,


            # BASIC INFO
            "title": title,

            "participants": [],


            # RAW CONTENT
            "transcript": transcript,


            # AI OUTPUTS
            "summary": summary,

            "tasks": tasks,


            # AI METADATA
            "tags": [],

            "topics": [],


            # INPUT SOURCE
            "source_type": "text",


            # PROCESSING STATE
            "processing_status": "completed",


            # TIMESTAMPS
            "created_at": str(datetime.utcnow()),

            "updated_at": str(datetime.utcnow())
        }


        logger.info(f"Meeting document build completed: {meeting_id}")


        return meeting_document


    except Exception as e:

        logger.error(f"Meeting document build failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Meeting document build failed"
        )



def format_retrieved_chunks(documents):

    try:

        logger.info("Retrieved chunk formatting started")


        formatted_chunks = "\n\n".join(documents)


        logger.info("Retrieved chunk formatting completed")


        return formatted_chunks


    except Exception as e:

        logger.error(f"Retrieved chunk formatting failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Retrieved chunk formatting failed"
        )