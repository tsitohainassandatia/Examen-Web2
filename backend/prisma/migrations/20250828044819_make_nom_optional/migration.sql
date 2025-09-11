-- CreateTable
CREATE TABLE "public"."utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT,
    "email" TEXT NOT NULL,
    "mot_de_pass" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "public"."utilisateurs"("email");
