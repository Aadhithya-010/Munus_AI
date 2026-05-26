from fastapi import FastAPI

from app.api.routes import( 
    health,
    meetings,
    workspace,
    chat,
    auth
)

app = FastAPI(
    title="MUNUS AI",
    version="1.0.0"
)

# MUNUS ROUTES
app.include_router(health.router)
app.include_router(meetings.router)
app.include_router(workspace.router)
app.include_router(chat.router)
app.include_router(auth.router)





@app.get("/")
def root():

    return {
        "message": "MUNUS AI API Running"
    }