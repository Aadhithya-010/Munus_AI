from fastapi import HTTPException

from app.core.logger import logger

from app.db.chroma import collection

from app.services.embedding_service import generate_embedding
from app.services.meeting_service import split_transcript



def store_meeting_memory(

    meeting_id: str,

    text: str,

    workspace_id: str,

    created_by: str
):

    try:

        logger.info(f"Meeting memory storage started: {meeting_id}")


        chunks = split_transcript(text)

        logger.info(f"Transcript split into {len(chunks)} chunks for meeting: {meeting_id}")


        ids = []

        embeddings = []

        documents = []

        metadatas = []


        for index, chunk in enumerate(chunks):

            try:

                logger.info(f"Embedding generation started for chunk {index}")


                embedding = generate_embedding(chunk)


                chunk_id = f"{meeting_id}_chunk_{index}"


                ids.append(chunk_id)

                embeddings.append(embedding)

                documents.append(chunk)

                metadatas.append({

                    "meeting_id": meeting_id,

                    "workspace_id": workspace_id,

                    "created_by": created_by,

                    "chunk_index": index
                })


                logger.info(f"Embedding generated for chunk {index}")


            except Exception as e:

                logger.error(f"Chunk embedding failed for chunk {index}: {str(e)}")

                raise HTTPException(

                    status_code=500,

                    detail=f"Embedding failed for chunk {index}"
                )


        collection.add(

            ids=ids,

            embeddings=embeddings,

            documents=documents,

            metadatas=metadatas
        )


        logger.info(f"Meeting memory stored successfully: {meeting_id}")


    except HTTPException as http_error:

        logger.error(f"HTTP Exception during vector storage: {http_error.detail}")

        raise http_error


    except Exception as e:

        logger.error(f"Meeting memory storage failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Meeting memory storage failed"
        )



def search_meeting_memory(

    query: str,

    workspace_id: str,

    meeting_id: str,

    n_results: int = 5
):

    try:

        logger.info("Semantic memory search started")


        embedding = generate_embedding(query)


        results = collection.query(

            query_embeddings=[embedding],

            n_results=n_results,

            where={
                "$and":[
                    {"workspace_id": workspace_id},

                    {"meeting_id": meeting_id}
                    ]
                }
        )


        logger.info("Semantic memory search completed")


        return results


    except Exception as e:

        logger.error(f"Semantic memory search failed: {str(e)}")

        raise HTTPException(

            status_code=500,

            detail="Semantic memory search failed"
        )