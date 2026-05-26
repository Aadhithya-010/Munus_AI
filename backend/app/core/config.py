from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

MONGO_URI = os.getenv("MONGO_URI")

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH")

SECRET_KEY = os.getenv("SECRET_KEY")

UPLOAD_DIR = "uploads"

CHUNK_SIZE= 500

CHUNK_OVERLAP = 100