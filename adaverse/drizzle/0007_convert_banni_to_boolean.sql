-- Migration pour convertir la colonne banni de text à boolean
ALTER TABLE "user" ALTER COLUMN "banni" TYPE boolean 
USING CASE 
  WHEN banni = 'true' OR banni = '1' THEN true 
  WHEN banni = 'false' OR banni = '0' THEN false 
  ELSE false 
END;
