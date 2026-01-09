from typing import Any
from sqlalchemy.orm import as_declarative, declared_attr

@as_declarative()
class Base:
    id: Any
    __name__: str

    # Tự động tạo tên bảng trong Database dựa theo tên Class (viết thường)
    # Ví dụ: Class User -> bảng 'user', Class Transaction -> bảng 'transaction'
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()