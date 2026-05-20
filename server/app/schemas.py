from typing import Dict, List

from pydantic import BaseModel


class ComposeRequest(BaseModel):
    left: str
    right: str


class ComposeResponse(BaseModel):
    operation: str
    symbol: str
    left: str
    right: str
    result: str
    explanation: str


class ResidualRequest(BaseModel):
    a: str
    c: str


class ResidualResponse(BaseModel):
    residual: str
    meaning: str


class LeRequest(BaseModel):
    a: str
    b: str


class LeResponse(BaseModel):
    result: bool
    meaning: str


class JoinRequest(BaseModel):
    elements: List[str]


class JoinResponse(BaseModel):
    join: str
    meaning: str


class PropertiesResponse(BaseModel):
    commutative: bool
    idempotent: bool
    integral: bool
    distributive: bool


class MonoidVerification(BaseModel):
    closure: bool
    associativity: bool
    identity: bool


class VerifyResponse(BaseModel):
    monoid: MonoidVerification
    adjunction: bool
    distributivity: bool
    monoid_valid: bool
    distributive: bool
    adjunction_holds: bool


class AdjunctionResponse(BaseModel):
    adjunction_holds: bool


class ElementsResponse(BaseModel):
    elements: List[str]
    top: str
    bottom: str


class OrderResponse(BaseModel):
    edges: List[List[str]]


class LogsResponse(BaseModel):
    logs: List[str]
