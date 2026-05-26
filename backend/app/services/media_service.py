import subprocess

from fastapi import HTTPException

from app.core.logger import logger



def extract_audio_from_video(

    video_path: str,

    output_audio_path: str
):

    try:

        logger.info(f"Audio extraction started for video: {video_path}")

        command = [

            "ffmpeg",

            "-i", video_path,

            "-vn",

            "-acodec", "mp3",

            output_audio_path
        ]


        subprocess.run(

            command,

            check=True
        )

        logger.info(f"Audio extraction completed: {output_audio_path}")

        return output_audio_path


    except subprocess.CalledProcessError as e:

        logger.error(f"FFmpeg extraction failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Video audio extraction failed"
        )


    except Exception as e:

        logger.error(f"Unexpected audio extraction failure: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Audio extraction failed"
        )