import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTableCreator, unique } from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `${name}`,
);

// export const posts = createTable(
//   "post",
//   (d) => ({
//     id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
//     name: d.text({ length: 256 }),
//     createdById: d
//       .text({ length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: d
//       .integer({ mode: "timestamp" })
//       .default(sql`(unixepoch())`)
//       .notNull(),
//     updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
//   }),
//   (t) => [
//     index("created_by_idx").on(t.createdById),
//     index("name_idx").on(t.name),
//   ],
// );

export const users = createTable("user", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }).notNull(),
  email: d.text({ length: 255 }).notNull().unique(),
  emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  role: d.text({ length: 50 }).default('user'),
  image: d.text({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.text({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.text({ length: 255 }).notNull(),
    providerAccountId: d.text({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.text({ length: 255 }),
    scope: d.text({ length: 255 }),
    id_token: d.text(),
    session_state: d.text({ length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.text({ length: 255 }).notNull(),
    token: d.text({ length: 255 }).notNull(),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const categories = createTable('categories', (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }).notNull(),
  description: d.text({ length: 255 }),
  isGlasses: d.integer({ mode: 'boolean' }).default(false),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const lenses = createTable('lens', (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }).notNull(),
  price: d.numeric({ mode: 'number' }),
}));

export const lensesRelations = relations(lenses, ({ many }) => ({
  productVariants: many(productVariants),
}));

export const promoTypes = [
  'discount',
  'promo',
] as const;

export const promos = createTable('promos', (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }).notNull(),
  type: d.text({ enum: promoTypes }).default('promo'),
  description: d.text({ mode: 'text' }),
  image: d.text({ mode: 'text' }),
  startDate: d.integer({ mode: 'timestamp' }),
  endDate: d.integer({ mode: 'timestamp' }),
  discountPercent: d.integer(),
}));

export const promosRelations = relations(promos, ({ many }) => ({
  products: many(products),
}));

// products tables
export const products = createTable(
  'products',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    categoryId: d
      .text({ length: 255 })
      .notNull()
      .references(() => categories.id),
    promoId: d
      .text()
      .references(() => promos.id),
    name: d.text({ length: 255 }).notNull(),
    description: d.text({ mode: 'text' }),
    productType: d.text({ enum: ['glasses', 'other']}),
    glassesCode: d.text({ length: 255 }), // only for productType === glasses
    createdAt: d.integer({ mode: 'timestamp' }).default(new Date),
  }),
);

export const productsRelations = relations(products, ({ many, one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  promo: one(promos, {
    fields: [products.promoId],
    references: [promos.id],
  }),
  productAdvantages: many(productAdvantages),
  productImages: many(productImages),
  productVariants: many(productVariants),
  attributes: many(attributes),
}));

export const productAdvantages = createTable(
  'productAdvantages',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: d
      .text()
      .notNull()
      .references(() => products.id),
    value: d.text({ length: 255 }).notNull(),
  }),
);

export const productAdvantagesRelations = relations(
  productAdvantages,
  ({ one }) => ({
    product: one(products, {
      fields: [productAdvantages.productId],
      references: [products.id],
    }),
  }),
);

export const productImages = createTable(
  'productImages',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: d
      .text({ length: 255 })
      .notNull()
      .references(() => products.id),
    image: d.text({ mode: 'text' }),
    sortOrder: d.integer().notNull().default(0),
  }),
);

export const productImagesRelations = relations(productImages, ({ one, many }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  attributeValues: many(attributeValues),
}));

export const productVariants = createTable(
  'productVariants',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: d
      .text({ length: 255 })
      .notNull()
      .references(() => products.id),
    lensesId: d
      .text({ length: 255 })
      .references(() => lenses.id),
    price: d.numeric({ mode: 'number' }).notNull(),
    stock: d.integer().notNull().default(0),
  }),
);

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  lens: one(lenses, {
    fields: [productVariants.lensesId],
    references: [lenses.id],
  }),
  variantAttributes: many(variantAttributes),
}));

export const attributes = createTable(
  'attributes',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: d
      .text({ length: 255 })
      .notNull()
      .references(() => products.id),
    name: d.text({ length: 255 }).notNull(),
  }),
);

export const attributesRelations = relations(attributes, ({ one, many }) => ({
  product: one(products, {
    fields: [attributes.productId],
    references: [products.id],
  }),
  attributeValues: many(attributeValues),
}));

export const attributeValues = createTable(
  'attributeValues',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(()=> crypto.randomUUID()),
    attributeId: d
      .text({ length: 255 })
      .notNull()
      .references(() => attributes.id),
    productImageId: d
      .text({ length: 255 })
      .references(() => productImages.id),
    value: d.text({ length: 255 }).notNull(),
  }),
);

export const attributeValuesRelations = relations(attributeValues, ({ one, many }) => ({
  attribute: one(attributes, {
    fields: [attributeValues.attributeId],
    references: [attributes.id],
  }),
  productImage: one(productImages, {
    fields: [attributeValues.productImageId],
    references: [productImages.id],
  }),
  variantAttributes: many(variantAttributes),
}));

export const variantAttributes = createTable(
  'variantAttributes',
  (d) => ({
    id: d
      .text({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productVariantId: d
      .text({ length: 255 })
      .notNull()
      .references(() => productVariants.id),
    attributeValueId: d
      .text({ length: 255 })
      .notNull()
      .references(() => attributeValues.id),
  }),
  (t) => [
    unique().on(
      t.productVariantId,
      t.attributeValueId,
    ),
  ],
);

export const variantAttributesRelations = relations(variantAttributes, ({ one }) => ({
  productVariant: one(productVariants, {
      fields: [variantAttributes.productVariantId],
      references: [productVariants.id],
    }),
    attributeValue: one(attributeValues, {
      fields: [variantAttributes.attributeValueId],
      references: [attributeValues.id],
    }),
}));
