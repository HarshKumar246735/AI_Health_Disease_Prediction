"""HealthPredict ML service: a thin FastAPI wrapper around predictor.py."""
import os
from typing import Any, Dict

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

import predictor
from schemas import SCHEMAS, public_schema

app = FastAPI(title="HealthPredict ML Service", version="1.0.0")
API_KEY = os.getenv("ML_API_KEY")  # optional shared secret between Node and this service


def require_key(x_api_key: str = Header(default=None)):
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail={"message": "Invalid API key."})


class PredictRequest(BaseModel):
    disease: str
    inputs: Dict[str, Any]


@app.get("/")
@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/schemas", dependencies=[Depends(require_key)])
def list_schemas():
    return [public_schema(d) for d in SCHEMAS]


@app.get("/schemas/{disease_id}", dependencies=[Depends(require_key)])
def get_schema(disease_id: str):
    if disease_id not in SCHEMAS:
        raise HTTPException(status_code=404, detail={"message": "Unknown condition."})
    return public_schema(disease_id)


@app.post("/predict", dependencies=[Depends(require_key)])
def predict(body: PredictRequest):
    try:
        return predictor.predict(body.disease, body.inputs)
    except KeyError:
        raise HTTPException(status_code=404, detail={"message": "Unknown condition."})
    except predictor.ValidationFailed as exc:
        return JSONResponse(status_code=422, content={"message": "Some inputs are invalid.", "errors": exc.errors})
    except predictor.ModelUnavailable as exc:
        raise HTTPException(status_code=503, detail={"message": str(exc)})


@app.get("/models/info", dependencies=[Depends(require_key)])
def models_info():
    return predictor.model_info()


@app.exception_handler(HTTPException)
async def http_error(_, exc: HTTPException):
    content = exc.detail if isinstance(exc.detail, dict) else {"message": str(exc.detail)}
    return JSONResponse(status_code=exc.status_code, content=content)


if __name__ == "__main__":
    import uvicorn

    # Render provides PORT; bind to 0.0.0.0 so it is reachable from other services.
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
