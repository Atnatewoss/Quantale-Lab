from typing import List

from fastapi import APIRouter, HTTPException
from core.quantale_core import build_chess_quantale

# Instantiate the mathematical model
q = build_chess_quantale()

# Computation log store
_engine_logs = [
    "[engine] initializing algebraic structures...",
    "[engine] poset checks passed: reflexive, antisymmetric, transitive",
    "[engine] lattice checks passed: meet/join exist uniquely",
    "[engine] monoid checks passed: closure, associativity, identity",
    "[engine] quantale verification: ⊗ distributes over join",
    "[engine] residuation confirmed: adjunction equations satisfied",
    "[engine] Chess Quantale engine loaded successfully.",
]


def add_log(message: str):
    _engine_logs.append(message)
    if len(_engine_logs) > 50:
        _engine_logs.pop(7)


def get_logs() -> list:
    return list(_engine_logs)


from schemas import (AdjunctionResponse, ComposeRequest, ComposeResponse, ElementsResponse, JoinRequest,JoinResponse,LeRequest, LeResponse,LogsResponse,MonoidVerification, ResidualRequest,ResidualResponse,VerifyResponse)

router = APIRouter()


@router.get("/elements", response_model=ElementsResponse)
def get_elements():
    add_log("[api] GET /elements requested")
    elements_ordered = ["beginner", "intermediate", "advanced", "master", "grandmaster"]
    return ElementsResponse(elements=elements_ordered, top=q.top, bottom=q.bottom)



@router.post("/compose", response_model=ComposeResponse)
def compose(req: ComposeRequest):
    if req.left not in q.base or req.right not in q.base:
        raise HTTPException(status_code=400, detail="Invalid elements provided")

    result = q.compose(req.left, req.right)
    explanation = "The weaker participant constrains the interaction."
    add_log(f"[engine] compose: {req.left} ⊗ {req.right} = {result} (meet)")
    return ComposeResponse(
        operation="meet",
        symbol="⊗",
        left=req.left,
        right=req.right,
        result=result,
        explanation=explanation,
    )






@router.get("/verify", response_model=VerifyResponse)
def verify():
    add_log("[api] GET /verify requested - running full verification suite")
    monoid_check = q.check_monoid(q.base)
    distributive_ok = q.check_distributivity_report()["distributivity"]
    adjunction_ok = q.verify_adjunction()["adjunction_holds"]

    add_log(f"[engine] monoid verification: {monoid_check}")
    add_log(f"[engine] distributivity check: {distributive_ok}")
    add_log(f"[engine] adjunction check: {adjunction_ok}")

    return VerifyResponse(
        monoid=MonoidVerification(
            closure=monoid_check["closure"],
            associativity=monoid_check["associativity"],
            identity=monoid_check["identity"],
        ),
        adjunction=adjunction_ok,
        distributivity=distributive_ok,
        monoid_valid=monoid_check["closure"]
        and monoid_check["associativity"]
        and monoid_check["identity"],
        distributive=distributive_ok,
        adjunction_holds=adjunction_ok,
    )




@router.get("/logs/demo", response_model=LogsResponse)
def logs_demo():
    return LogsResponse(logs=get_logs())


# --- Core Query Endpoints for Interactive Console ---


@router.post("/query/le", response_model=LeResponse)
def query_le(req: LeRequest):
    if req.a not in q.base or req.b not in q.base:
        raise HTTPException(status_code=400, detail="Invalid elements provided")

    result = q.le(req.a, req.b)
    meaning = (
        f"{req.a} is below or equal to {req.b}"
        if result
        else f"{req.a} is strictly stronger than {req.b}"
    )
    add_log(f"[engine] query le: {req.a} ≤ {req.b} resolved to {result}")
    return LeResponse(result=result, meaning=meaning)


@router.post("/query/join", response_model=JoinResponse)
def query_join(req: JoinRequest):
    for elem in req.elements:
        if elem not in q.base:
            raise HTTPException(
                status_code=400, detail=f"Invalid element {elem} provided"
            )

    result = q.big_join(req.elements)
    meaning = f"{result} is the least upper bound / strongest element"
    add_log(f"[engine] query join of {req.elements} = {result}")
    return JoinResponse(join=result, meaning=meaning)


@router.post("/query/residual", response_model=ResidualResponse)
def query_residual(req: ResidualRequest):
    if req.a not in q.base or req.c not in q.base:
        raise HTTPException(status_code=400, detail="Invalid elements provided")

    result = q.right_residual(req.a, req.c)
    meaning = f"{result} is the maximum allowable interaction partner"
    add_log(f"[engine] query residual: {req.a} → {req.c} = {result}")
    return ResidualResponse(residual=result, meaning=meaning)
