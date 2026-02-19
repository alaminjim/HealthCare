-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_specialty_isDeleted" ON "specialties"("isDelete");

-- CreateIndex
CREATE INDEX "idx_specialty_title" ON "specialties"("title");
