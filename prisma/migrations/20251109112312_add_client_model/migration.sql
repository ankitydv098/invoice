-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
