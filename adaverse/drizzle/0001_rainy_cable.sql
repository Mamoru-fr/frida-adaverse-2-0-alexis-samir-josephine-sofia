ALTER TABLE "comments" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "student_projects" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "student_projects" ADD CONSTRAINT "student_projects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;