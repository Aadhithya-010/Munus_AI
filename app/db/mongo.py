from pymongo import MongoClient
from app.core.config import MONGO_URI

client = MongoClient(MONGO_URI)

db = client["MUNUS01"]