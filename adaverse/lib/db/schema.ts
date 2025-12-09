import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";

// Table des types de projets Ada (Adaopte, Ada Quiz, etc.)
export const projectsTypes = pgTable("projects_types", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
});

// Table des promotions Ada (Frida, etc.)
export const promotions = pgTable("promotions", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    startDate: timestamp("start_date").notNull(),
});

// Table des projets étudiants
export const studentProjects = pgTable("student_projects", {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    slug: varchar("slug").notNull().unique(),
    githubUrl: text("github_url").notNull(),
    demoUrl: text("demo_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"), // null = non publié
    promotionId: integer("promotion_id")
        .references(() => promotions.id, { onDelete: "cascade" })
        .notNull(),
    projectTypeId: integer("project_type_id")
        .references(() => projectsTypes.id, { onDelete: "cascade" })
        .notNull(),
});