import uuid

from fastapi import HTTPException

from app.core.logger import logger

from app.agents.summarizer_agent import summarize_meeting
from app.agents.planner_agent import extract_tasks

from app.services.mongo_service import save_meeting
from app.services.vector_service import store_meeting_memory
from app.services.meeting_service import build_meeting_document




async def process_meeting(data):

    try:

        logger.info(f"Meeting processing started for workspace: {data.workspace_id}")

        meeting_id = str(uuid.uuid4())

        logger.info(f"Generated meeting ID: {meeting_id}")

        transcript = data.transcript

        logger.info(f"Transcript received for meeting: {meeting_id}")


        # AGENT 1 — SUMMARIZER
        try:

            logger.info(f"Generating summary for meeting: {meeting_id}")

            summary = await summarize_meeting(transcript)

            logger.info(f"Summary generated successfully for meeting: {meeting_id}")

        except Exception as e:

            logger.error(f"Summary generation failed for meeting {meeting_id}: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to generate meeting summary"
            )


        # AGENT 2 — TASK EXTRACTION
        try:

            logger.info(f"Extracting tasks for meeting: {meeting_id}")

            tasks = await extract_tasks(transcript)

            logger.info(f"Task extraction completed for meeting: {meeting_id}")

        except Exception as e:

            logger.error(f"Task extraction failed for meeting {meeting_id}: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to extract meeting tasks"
            )


        # VECTOR STORAGE
        try:

            logger.info(f"Storing semantic memory for meeting: {meeting_id}")

            store_meeting_memory(

                meeting_id=meeting_id,

                text=transcript,

                workspace_id=data.workspace_id,

                created_by=data.created_by
            )

            logger.info(f"Semantic memory stored successfully for meeting: {meeting_id}")


        except Exception as e:

            logger.error(f"Semantic memory storage failed for meeting {meeting_id}: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to store semantic memory"
            )


        # BUILD MEETING DOCUMENT
        try:

            logger.info(f"Building meeting document for meeting: {meeting_id}")

            meeting_document = build_meeting_document(

                meeting_id=meeting_id,

                title=data.title,

                transcript=transcript,

                summary=summary,

                tasks=tasks,

                workspace_id=data.workspace_id,

                created_by=data.created_by
            )


            logger.info(f"Meeting document built successfully for meeting: {meeting_id}")


        except Exception as e:

            logger.error(f"Meeting document build failed for meeting {meeting_id}: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to build meeting document"
            )


        # SAVE TO MONGO
        try:

            logger.info(f"Saving meeting document to MongoDB for meeting: {meeting_id}")

            saved_document = save_meeting(meeting_document)


            logger.info(f"Meeting saved successfully: {meeting_id}")


        except Exception as e:

            logger.error(f"MongoDB save failed for meeting {meeting_id}: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to save meeting"
            )


        logger.info(f"Meeting processing completed successfully: {meeting_id}")


        return saved_document


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during meeting processing: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected meeting processing failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Meeting processing failed"
        )