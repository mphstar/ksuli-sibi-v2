-- CreateTable
CREATE TABLE "visitor" (
    "id" BIGSERIAL NOT NULL,
    "ip_address" VARCHAR,
    "browser" VARCHAR,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_pkey" PRIMARY KEY ("id")
);
