import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  uuid,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Master list: product categories (dropdown + filters). */
export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type TemplateFieldType = "text" | "textarea" | "dimension" | "select";

export type TemplateFieldDef = {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  unitOptions?: string[];
  options?: string[];
  sortOrder: number;
};

export type ProductAttributeValue =
  | string
  | {
      value: string;
      unit?: string;
    };

/** Sub-categories under a parent category. */
export const productSubcategories = pgTable(
  "product_subcategories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => productCategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("product_subcategories_category_slug_uidx").on(t.categoryId, t.slug)]
);

/** Per-category (or sub-category) product form field template. */
export const categoryProductTemplates = pgTable(
  "category_product_templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => productCategories.id, { onDelete: "cascade" }),
    /** Null = category-level template; set = sub-category override. */
    subCategoryId: uuid("sub_category_id").references(() => productSubcategories.id, {
      onDelete: "cascade",
    }),
    fields: jsonb("fields").$type<TemplateFieldDef[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("category_product_templates_cat_sub_uidx").on(t.categoryId, t.subCategoryId),
  ]
);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  /** Denormalized storefront label, e.g. "Cooking › Gas ranges" — kept in sync from taxonomy on save. */
  category: text("category"),
  categoryId: uuid("category_id").references(() => productCategories.id, {
    onDelete: "set null",
  }),
  subCategoryId: uuid("sub_category_id").references(() => productSubcategories.id, {
    onDelete: "set null",
  }),
  images: text("images").array().notNull().default([]),
  isAvailable: boolean("is_available").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  /** Values for category template fields (dimensions, color, material, etc.). */
  attributes: jsonb("attributes")
    .$type<Record<string, ProductAttributeValue>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  /** Gallery image URLs; first is used as cover when saving from admin. */
  images: text("images").array().notNull().default([]),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tradeEnquiries = pgTable("trade_enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  emirate: text("emirate"),
  serviceInterest: text("service_interest"),
  message: text("message").notNull(),
  attachmentUrl: text("attachment_url"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type RfqLineItem = {
  item: string;
  qty: string;
  unit: string;
  notes: string;
};

export const rfqSubmissions = pgTable("rfq_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: text("company_name").notNull(),
  tradeLicenceNo: text("trade_licence_no"),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  budgetAed: text("budget_aed"),
  emirate: text("emirate"),
  requiredDate: text("required_date"),
  lineItems: jsonb("line_items").$type<RfqLineItem[]>().notNull(),
  attachmentUrls: text("attachment_urls").array().notNull().default([]),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type QuoteCartItem = {
  name: string;
  category: string;
  price: string;
  qty: number;
};

/** Staff accounts: `/auth` sign-up defaults to `admin`; set `superadmin` in Neon for full access (Contacts). */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  profileImageUrl: text("profile_image_url"),
  /** Neon: exactly `admin` or `superadmin` (lowercase). */
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

export type SignupOtpPayload = {
  fullName: string;
  passwordHash: string;
  profileImageUrl: string | null;
  profilePendingKey: string | null;
};

/** Ephemeral OTP + pending signup snapshot (hashed OTP only). Deleted after verify. */
export const authOtpChallenges = pgTable("auth_otp_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  purpose: text("purpose").notNull(),
  otpHash: text("otp_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  signupPayload: jsonb("signup_payload").$type<SignupOtpPayload | null>(),
  attemptCount: integer("attempt_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const quotations = pgTable("quotations", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  address: text("address"),
  /** How the customer submitted: `email` (quote form) or `whatsapp` (save + open WhatsApp). */
  source: text("source").notNull().default("email"),
  items: jsonb("items").$type<QuoteCartItem[]>().notNull(),
  message: text("message"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
