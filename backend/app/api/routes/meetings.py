from fastapi import (
    APIRouter,
    UploadFile,
    HTTPException,
    Depends,
    File
)

from app.core.logger import logger
from app.core.config import UPLOAD_DIR

from app.schemas.meeting_schema import MeetingInput

from app.agents.orchestrator import process_meeting

from app.services.transcription_service import transcribe_audio
from app.services.media_service import extract_audio_from_video
from app.services.mongo_service import(
    get_user_meetings,
    get_workspace_meetings
)

from app.dependencies.auth_dependencies import get_current_user
from app.dependencies.meeting_dependencies import validate_meeting_access
from app.dependencies.workspace_dependencies import validate_workspace_access


router = APIRouter(
    prefix="/api/v1/meetings",
    tags=["Meetings"]
)



# POST ENDPOINTS

# MEETING TRANSCRIPT UPLOAD
@router.post("/upload")
async def upload_meeting(

    meeting: MeetingInput,

    current_user = Depends(
        get_current_user
    )
):

    try:

        logger.info(f"Transcript meeting upload started by {current_user['email']}")

        validate_workspace_access(

            meeting.workspace_id,

            current_user
        )

        class TempMeeting:
            pass


        meeting_data = TempMeeting()

        meeting_data.title = meeting.title

        meeting_data.workspace_id = meeting.workspace_id

        meeting_data.transcript = meeting.transcript

        meeting_data.created_by = current_user["email"]


        result = await process_meeting(meeting_data)
        


        logger.info(f"Transcript meeting upload completed for {current_user['email']}")


        return {

            "success": True,

            "message": "Meeting processed successfully",

            "data": result
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during transcript upload: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected transcript upload failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Meeting upload failed"
        )



# UPLOAD AUDIO FOR TRANSCRIPT
@router.post("/upload-audio")
async def upload_audio_meeting(

    title: str,

    workspace_id: str,

    audio: UploadFile = File(...),

    current_user = Depends( get_current_user)
    
):

    try:

        logger.info(f"Audio meeting upload started by {current_user['email']}")

        validate_workspace_access(

             workspace_id,

             current_user
        )
        upload_dir = UPLOAD_DIR

        file_path = f"{upload_dir}/{audio.filename}"


        try:

            with open(file_path, "wb") as buffer:

                buffer.write(await audio.read())

            logger.info(f"Audio file saved: {file_path}")


        except Exception as e:

            logger.error(f"Audio file save failed: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to save audio file"
            )


        try:

            transcript = transcribe_audio(file_path)

            logger.info(f"Audio transcription completed: {file_path}")


        except Exception as e:

            logger.error(f"Audio transcription failed: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Audio transcription failed"
            )


        class TempMeeting:
            pass


        meeting_data = TempMeeting()

        meeting_data.title = title

        meeting_data.workspace_id = workspace_id

        meeting_data.created_by = current_user["email"]

        meeting_data.transcript = transcript


        result = await process_meeting(meeting_data)
        


        logger.info(f"Audio meeting processing completed for {current_user['email']}")


        return {

            "success": True,

            "transcript": transcript,

            "data": result
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during audio upload: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected audio upload failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Audio meeting upload failed"
        )



# UPLOAD VIDEO FOR TRANSCRIPT
@router.post("/upload-video")
async def upload_video_meeting(

    title: str,

    workspace_id: str,

    video: UploadFile = File(...),

    current_user = Depends(
        get_current_user
    )
):

    try:

        logger.info(f"Video meeting upload started by {current_user['email']}")

        validate_workspace_access(

             workspace_id,

             current_user
        )

        upload_dir = UPLOAD_DIR

        video_path = f"{upload_dir}/{video.filename}"


        try:

            with open(video_path, "wb") as buffer:

                buffer.write( await video.read())
                

            logger.info(f"Video file saved: {video_path}")


        except Exception as e:

            logger.error(f"Video file save failed: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to save video file"
            )


        audio_path = f"{upload_dir}/extracted_audio.mp3"


        try:

            extract_audio_from_video(

                video_path,

                audio_path
            )

            logger.info(f"Audio extracted from video: {video_path}")


        except Exception as e:

            logger.error(f"Video audio extraction failed: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Failed to extract audio from video"
            )


        try:

            transcript = transcribe_audio(audio_path)
            

            logger.info(f"Video transcription completed: {video_path}")


        except Exception as e:

            logger.error(f"Video transcription failed: {str(e)}")

            raise HTTPException(

                status_code=500,

                detail="Video transcription failed"
            )


        class TempMeeting:
            pass


        meeting_data = TempMeeting()

        meeting_data.title = title

        meeting_data.workspace_id = workspace_id

        meeting_data.created_by = current_user["email"]

        meeting_data.transcript = transcript


        result = await process_meeting(meeting_data)
        


        logger.info(f"Video meeting processing completed for {current_user['email']}")


        return {

            "success": True,

            "transcript": transcript,

            "data": result
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during video upload: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected video upload failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Video meeting upload failed"
        )



# GET ENDPOINTS

# GET ALL MEETINGS BELONGING TO CURRENT USER
@router.get("/")
async def get_meetings(

    current_user = Depends(get_current_user)

):

    try:

        logger.info(f"Meeting list retrieval started for {current_user['email']}")


        meetings = get_user_meetings(

            current_user["email"]
        )


        logger.info(f"Meeting list retrieved for {current_user['email']}")


        return {

            "success": True,

            "count": len(meetings),

            "data": meetings
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during meeting list retrieval: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected meeting list retrieval failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve meetings"
        )


# GET MEETINGS OF A SPECIFIC WORKSPACE
@router.get("/workspace/{workspace_id}")
async def get_workspace_meeting_list(

    workspace_id: str,

    current_user = Depends(get_current_user)
):

    try:

        logger.info(f"Workspace meeting retrieval started: {workspace_id}")

        validate_workspace_access(

            workspace_id,

            current_user
        )

        meetings = get_workspace_meetings(

            workspace_id,

            current_user["email"]
        )

        logger.info(f"Workspace meeting retrieval completed: {workspace_id}")

        return {

            "success": True,

            "count": len(meetings),

            "data": meetings
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during workspace meeting retrieval: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Workspace meeting retrieval failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve workspace meetings"
        )
    


# GET SPECIFIC MEETING DETAILS OF THE USER
@router.get("/{meeting_id}")
async def get_single_meeting(

    meeting_id: str,

    current_user = Depends( get_current_user)

):

    try:

        logger.info(f"Single meeting retrieval started for meeting: {meeting_id}")


        meeting = await validate_meeting_access(

            meeting_id,

            current_user
        )


        meeting["_id"] = str(
            meeting["_id"]
        )


        logger.info(f"Single meeting retrieved successfully: {meeting_id}")


        return {

            "success": True,

            "data": {

                "meeting_id": meeting["meeting_id"],

                "title": meeting["title"],

                "summary": meeting["summary"],

                "tasks": meeting["tasks"],

                "transcript": meeting["transcript"],

                "workspace_id": meeting["workspace_id"],

                "created_by": meeting["created_by"],

                "created_at": meeting["created_at"]
            }
        }


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during single meeting retrieval: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Unexpected single meeting retrieval failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve meeting"
        )