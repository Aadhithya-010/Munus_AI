from fastapi import HTTPException

from faster_whisper import WhisperModel

from app.core.logger import logger



model = WhisperModel(

    "base",

    compute_type="int8"
)



def transcribe_audio(audio_path: str):

    try:

        logger.info(f"Audio transcription started: {audio_path}")

        segments, info = model.transcribe(audio_path)

        transcript = ""


        for segment in segments:

            transcript += segment.text + " "


        transcript = transcript.strip()


        logger.info(f"Audio transcription completed: {audio_path}")


        return transcript


    except Exception as e:

        logger.error(f"Audio transcription failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Audio transcription failed"
        )