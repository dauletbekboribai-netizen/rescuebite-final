from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from app.models.domain import UserRole, Allergen, BatchState, BatchStatus, OrderStatus, ClaimStatus, RouteStatus


class ErrorResponse(BaseModel):
    code: str
    message: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=80)
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.consumer

    @field_validator('password')
    @classmethod
    def strong_password(cls, value: str) -> str:
        if not any(c.isupper() for c in value) or not any(c.isdigit() for c in value):
            raise ValueError('password must contain at least one uppercase letter and one digit')
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: str
    role: UserRole
    status: str
    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=3, max_length=80)


class AddressCreate(BaseModel):
    label: str = Field(max_length=80)
    city: str
    street: str
    lat: float
    lng: float


class AddressRead(AddressCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class AllergyUpdate(BaseModel):
    allergens: list[Allergen]


class IngredientIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    allergen: Optional[Allergen] = None


class AllergyCheckRequest(BaseModel):
    ingredients: list[IngredientIn]


class AllergyCheckResponse(BaseModel):
    safe: bool
    conflicts: list[Allergen]


class BatchCreate(BaseModel):
    title: str
    description: str = ''
    category: str
    quantity_total: int = Field(gt=0)
    original_price_kzt: int = Field(ge=0)
    expires_at: datetime
    pickup_start_at: datetime
    pickup_end_at: datetime
    lat: float
    lng: float
    ingredients: list[IngredientIn]


class BatchUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[BatchStatus] = None


class BatchRead(BaseModel):
    id: int
    restaurant_id: int
    title: str
    category: str
    quantity_total: int
    quantity_available: int
    original_price_kzt: int
    current_price_kzt: int
    discount_percentage: int
    state: BatchState
    status: BatchStatus
    expires_at: datetime
    lat: float
    lng: float
    model_config = ConfigDict(from_attributes=True)


class BatchList(BaseModel):
    items: list[BatchRead]
    next_cursor: Optional[str] = None


class ReservationCreate(BaseModel):
    batch_id: int
    quantity: int = Field(gt=0)


class ReservationRead(BaseModel):
    id: int
    batch_id: int
    quantity: int
    status: str
    expires_at: datetime
    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    reservation_id: int


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None


class OrderRead(BaseModel):
    id: int
    user_id: int
    reservation_id: Optional[int]
    total_kzt: int
    status: OrderStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class OrderList(BaseModel):
    items: list[OrderRead]
    next_cursor: Optional[str] = None


class DonationClaimCreate(BaseModel):
    batch_id: int
    quantity: int = Field(gt=0)


class DonationClaimUpdate(BaseModel):
    status: Optional[ClaimStatus] = None


class DonationClaimRead(BaseModel):
    id: int
    shelter_id: int
    batch_id: int
    quantity: int
    status: ClaimStatus
    model_config = ConfigDict(from_attributes=True)


class RouteAssignmentUpdate(BaseModel):
    status: Optional[RouteStatus] = None

class RouteStopRead(BaseModel):
    id: int
    assignment_id: int
    batch_id: Optional[int] = None
    kind: str
    sequence: int
    address: str
    lat: float
    lng: float
    status: str
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class RouteAssignmentRead(BaseModel):
    id: int
    driver_id: int
    status: RouteStatus
    stops: list[RouteStopRead] = []

    model_config = ConfigDict(from_attributes=True)


class RouteStopComplete(BaseModel):
    lat: float
    lng: float
    note: Optional[str] = None


class VerificationRequest(BaseModel):
    entity_type: str = Field(pattern='^(restaurant|shelter|driver)$')
    entity_id: int
    approved: bool
    reason: Optional[str] = None

class RouteStopCreate(BaseModel):
    batch_id: Optional[int] = None
    kind: str
    sequence: int
    address: str
    lat: float
    lng: float


class RouteAssignmentCreate(BaseModel):
    driver_id: int
    stops: list[RouteStopCreate]

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class MessageResponse(BaseModel):
    message: str

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None