from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    backend_host: str = Field(default="0.0.0.0", alias="BACKEND_HOST")
    backend_port: int = Field(default=8000, alias="BACKEND_PORT")
    cors_origins: str = Field(default="http://localhost:5173", alias="CORS_ORIGINS")

    max_model_size_mb: int = Field(default=100, alias="MAX_MODEL_SIZE_MB")
    max_images_per_request: int = Field(default=40, alias="MAX_IMAGES_PER_REQUEST")
    recommended_batch_size: int = Field(default=16, alias="RECOMMENDED_BATCH_SIZE")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
