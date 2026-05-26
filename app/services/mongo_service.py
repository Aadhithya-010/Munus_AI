from datetime import datetime

from fastapi import HTTPException

from app.core.logger import logger

from app.db.mongo import db



meetings_collection = db["meetings"]

chat_collection = db["chat_messages"]

users_collection = db["users"]

workspaces_collection = db["workspaces"]



# MEETING COLLECTION
def save_meeting(data: dict):

    try:

        logger.info("Meeting save started")

        result = meetings_collection.insert_one(data)
            
        data["_id"] = str(result.inserted_id)

        logger.info("Meeting saved successfully")

        return data


    except Exception as e:

        logger.error(f"Meeting save failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to save meeting"
        )



def get_meeting(meeting_id: str):

    try:

        logger.info(f"Meeting retrieval started: {meeting_id}")


        meeting = meetings_collection.find_one({ "meeting_id": meeting_id})


        logger.info(f"Meeting retrieval completed: {meeting_id}")


        return meeting


    except Exception as e:

        logger.error(f"Meeting retrieval failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve meeting"
        )



def get_user_meetings(created_by: str):
    try:

        logger.info(f"User meetings retrieval started: {created_by}")

        meetings = list( meetings_collection.find({"created_by": created_by}))

        formatted_meetings = []

        for meeting in meetings:

            formatted_meetings.append({

                "meeting_id": meeting["meeting_id"],

                "title": meeting["title"],

                "workspace_id": meeting["workspace_id"]
            })


        logger.info(f"User meetings retrieval completed: {created_by}")


        return formatted_meetings



    except Exception as e:

        logger.error(f"User meetings retrieval failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve user meetings"
        )


def get_workspace_meetings(

    workspace_id: str,

    created_by: str
):

    try:

        logger.info(f"Workspace meetings retrieval started: {workspace_id}")


        meetings = list(

            meetings_collection.find({

                "workspace_id": workspace_id,

                "created_by": created_by
            })
        )

        formatted_meetings = []


        for meeting in meetings:

            formatted_meetings.append({

                "meeting_id": meeting["meeting_id"],

                "title": meeting["title"]
            })


        logger.info(f"Workspace meetings retrieval completed: {workspace_id}")


        return formatted_meetings


    except Exception as e:

        logger.error(f"Workspace meetings retrieval failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve workspace meetings"
        )


# CHAT COLLECTION
def save_chat_message(

    meeting_id: str,

    workspace_id: str,

    query: str,

    response: str
):

    try:

        logger.info(f"Chat message save started for meeting: {meeting_id}")


        chat_document = {

            "meeting_id": meeting_id,

            "workspace_id": workspace_id,

            "query": query,

            "response": response,

            "timestamp": str(datetime.utcnow())
        }


        result = chat_collection.insert_one(chat_document)
        


        chat_document["_id"] = str(result.inserted_id)
        


        logger.info(f"Chat message saved for meeting: {meeting_id}")


        return chat_document


    except Exception as e:

        logger.error(f"Chat message save failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to save chat message"
        )



# USER COLLECTION
def create_user(user_data: dict):

    try:

        logger.info("User creation started")


        result = users_collection.insert_one(user_data)
        


        user_data["_id"] = str(result.inserted_id)
        


        logger.info("User created successfully")


        return user_data


    except Exception as e:

        logger.error(f"User creation failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to create user"
        )



def get_user_by_email(email:str):

    try:

        logger.info(f"User lookup started: {email}")


        user = users_collection.find_one({"email":email})


        logger.info(f"User lookup completed: {email}")


        return user


    except Exception as e:

        logger.error(f"User lookup failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve user"
        )
    

# WORKSPACE COLLECTION 
def create_workspace(
    workspace_data: dict
):

    try:

        logger.info("Workspace creation started")


        result = workspaces_collection.insert_one(workspace_data)


        workspace_data["_id"] = str(result.inserted_id)


        logger.info(f"Workspace created successfully: {workspace_data['workspace_id']}")


        return workspace_data


    except Exception as e:

        logger.error(f"Workspace creation failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to create workspace"
        )



def get_workspace( workspace_id: str):

    try:

        logger.info(f"Workspace retrieval started: {workspace_id}")

        workspace = workspaces_collection.find_one({"workspace_id": workspace_id})

        logger.info(f"Workspace retrieval completed: {workspace_id}")


        return workspace


    except Exception as e:

        logger.error(f"Workspace retrieval failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve workspace"
        )



def get_user_workspaces(email: str):

    try:

        logger.info(f"User workspace retrieval started: {email}")

        workspaces = list( workspaces_collection.find({ "members": email}))

        formatted_workspaces = []

        for workspace in workspaces:

            formatted_workspaces.append({

                "workspace_id": workspace["workspace_id"],

                "name": workspace["name"]
            })

        logger.info(f"User workspace retrieval completed: {email}")

        return formatted_workspaces



    except Exception as e:

        logger.error(f"User workspace retrieval failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Failed to retrieve user workspaces"
        )