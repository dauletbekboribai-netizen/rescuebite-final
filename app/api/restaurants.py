from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.database import get_session
from app.api.deps import get_current_user
from app.schemas.common import RestaurantUpdate
from app.models.domain import Restaurant, FoodBatch, CustomerOrder, OrderItem, DonationClaim, UserRole, BatchStatus, VerificationStatus, User

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("")
def restaurants(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
):
    items = session.exec(
        select(Restaurant)
        .where(Restaurant.verification_status == VerificationStatus.verified)
        .order_by(Restaurant.id.desc())
        .offset(offset)
        .limit(limit)
    ).all()

    return {"items": items, "limit": limit, "offset": offset}


@router.get("/{restaurant_id}")
def restaurant(
    restaurant_id: int,
    session: Session = Depends(get_session),
):
    item = session.get(Restaurant, restaurant_id)

    if not item:
        raise HTTPException(404, "restaurant not found")

    if item.verification_status != VerificationStatus.verified:
        raise HTTPException(403, "restaurant is not verified")

    return item


@router.get("/{restaurant_id}/batches")
def batches(
    restaurant_id: int,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
):
    restaurant = session.get(Restaurant, restaurant_id)

    if not restaurant:
        raise HTTPException(404, "restaurant not found")

    if restaurant.verification_status != VerificationStatus.verified:
        raise HTTPException(403, "restaurant is not verified")

    items = session.exec(
        select(FoodBatch)
        .where(
            FoodBatch.restaurant_id == restaurant_id,
            FoodBatch.status == BatchStatus.active,
        )
        .order_by(FoodBatch.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()

    return {"items": items, "limit": limit, "offset": offset}


@router.get("/{restaurant_id}/orders")
def orders(
    restaurant_id: int,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    restaurant = session.get(Restaurant, restaurant_id)

    if not restaurant:
        raise HTTPException(404, "restaurant not found")

    if restaurant.owner_id != user.id:
        raise HTTPException(403, "forbidden")

    items = session.exec(
        select(CustomerOrder)
        .distinct()
        .join(OrderItem)
        .join(FoodBatch)
        .where(FoodBatch.restaurant_id == restaurant_id)
        .options(
            selectinload(CustomerOrder.items)
            .selectinload(OrderItem.batch)
        )
        .order_by(CustomerOrder.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).unique().all()

    return {
        "restaurant": restaurant,
        "items": items,
        "limit": limit,
        "offset": offset,
    }


@router.get("/{restaurant_id}/donations")
def donations(
    restaurant_id: int,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):
    restaurant = session.get(Restaurant, restaurant_id)

    if not restaurant:
        raise HTTPException(404, "restaurant not found")

    if restaurant.owner_id != user.id:
        raise HTTPException(403, "forbidden")

    items = session.exec(
        select(DonationClaim)
        .distinct()
        .join(FoodBatch)
        .where(FoodBatch.restaurant_id == restaurant_id)
        .options(selectinload(DonationClaim.batch))
        .order_by(DonationClaim.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).unique().all()

    return {
        "restaurant": restaurant,
        "items": items,
        "limit": limit,
        "offset": offset,
    }

@router.patch("/{restaurant_id}")
def update_restaurant(
    restaurant_id: int,
    payload: RestaurantUpdate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):

    restaurant = session.get(Restaurant, restaurant_id)

    if not restaurant:
        raise HTTPException(404, "restaurant not found")

    is_admin = user.role == UserRole.admin
    is_owner = restaurant.owner_id == user.id

    if not (is_admin or is_owner):
        raise HTTPException(403, "forbidden")

    updates = payload.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(restaurant, field, value)

    session.add(restaurant)
    session.commit()
    session.refresh(restaurant)

    return restaurant

@router.delete("/{restaurant_id}")
def delete_restaurant(
    restaurant_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):

    restaurant = session.get(Restaurant, restaurant_id)

    if not restaurant:
        raise HTTPException(404, "restaurant not found")

    is_admin = user.role == UserRole.admin
    is_owner = restaurant.owner_id == user.id

    if not (is_admin or is_owner):
        raise HTTPException(403, "forbidden")

    session.delete(restaurant)
    session.commit()

    return {
        "message": "restaurant deleted"
    }

@router.put("/{restaurant_id}/publish")
def publish_restaurant(
    restaurant_id: int,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
):

    restaurant = session.get(Restaurant, restaurant_id)

    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail="restaurant not found"
        )

    if user.role != UserRole.restaurant_manager:
        raise HTTPException(
            status_code=403,
            detail="only restaurant managers can publish"
        )

    if restaurant.owner_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="you do not manage this restaurant"
        )

    restaurant.is_published = True

    session.add(restaurant)
    session.commit()
    session.refresh(restaurant)

    return restaurant