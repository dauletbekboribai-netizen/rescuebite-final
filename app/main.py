from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi
from starlette import status

import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

from app.core.config import get_settings
from app.database import create_db_and_tables

from app.api import (
    auth,
    users,
    batches,
    orders,
    donations,
    routes,
    admin,
    restaurants
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Creating database...")

    try:
        create_db_and_tables()
    except:
        pass

    print("App started")

    yield

    print("App stopped")


app = FastAPI(
    title="RescueBite API",
    version="1.0.0",
    description="RescueBite backend built with FastAPI PostgreSQL Redis",
    lifespan=lifespan
)


# ---------- CORS ----------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ] + settings.cors_origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

    expose_headers=["*"]
)


# ---------- Error Handler ----------

@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception
):

    print(exc)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": "internal_error",
            "message": str(exc)
        }
    )


# ---------- Health ----------

@app.get("/health", tags=["health"])
async def health():

    return {
        "status": "ok"
    }


# ---------- Routers ----------

app.include_router(auth.router)

app.include_router(users.router)

app.include_router(restaurants.router)

app.include_router(orders.router)

app.include_router(admin.router)

app.include_router(batches.router)

app.include_router(donations.router)

app.include_router(routes.router)


# ---------- Swagger JWT ----------

def custom_openapi():

    if app.openapi_schema:

        return app.openapi_schema

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes
    )

    schema.setdefault(
        "components",
        {}
    ).setdefault(
        "securitySchemes",
        {}
    )["BearerAuth"] = {

        "type": "http",

        "scheme": "bearer",

        "bearerFormat": "JWT"
    }

    schema.setdefault(
        "components",
        {}
    ).setdefault(
        "schemas",
        {}
    )["ErrorResponse"] = {

        "type": "object",

        "properties": {

            "code": {
                "type": "string"
            },

            "message": {
                "type": "string"
            }

        },

        "required": [
            "code",
            "message"
        ]
    }

    for path, methods in schema.get(
        "paths",
        {}
    ).items():

        for method, operation in methods.items():

            if method.lower() not in [
                "get",
                "post",
                "put",
                "patch",
                "delete"
            ]:
                continue

            public = [

                "/auth/login",

                "/auth/register",

                "/auth/verify",

                "/health"
            ]

            if path not in public:

                operation.setdefault(
                    "security",
                    [{"BearerAuth": []}]
                )

    app.openapi_schema = schema

    return app.openapi_schema


app.openapi = custom_openapi