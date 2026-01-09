import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# ------------------------------------------------------------------------
# 1. Thêm đường dẫn gốc để Python tìm thấy code trong thư mục 'app'
# ------------------------------------------------------------------------
sys.path.append(os.getcwd())

# ------------------------------------------------------------------------
# 2. Import Config và Models của dự án
# ------------------------------------------------------------------------
from app.core.config import settings
from app.db.base import Base
from app.models import * # Import tất cả models để Alembic nhận diện

# ------------------------------------------------------------------------
# 3. Cấu hình Logging
# ------------------------------------------------------------------------
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ------------------------------------------------------------------------
# 4. Gán Metadata (QUAN TRỌNG NHẤT ĐỂ SỬA LỖI CỦA BẠN)
# ------------------------------------------------------------------------
target_metadata = Base.metadata

# ------------------------------------------------------------------------
# 5. Hàm chạy Migration
# ------------------------------------------------------------------------
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    
    # Ghi đè cấu hình URL từ file .env
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        # Quan trọng: Phải truyền target_metadata vào đây
        context.configure(
            connection=connection, 
            target_metadata=target_metadata 
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()