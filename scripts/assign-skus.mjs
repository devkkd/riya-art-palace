/**
 * Migration: Assign SKU numbers to existing products
 * Run: node --require ./dns-patch.cjs scripts/assign-skus.mjs
 *
 * SKU format: RAP-00001, RAP-00002, ...
 */
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  readFileSync(envPath, "utf8").split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  });
}

const ProductSchema = new mongoose.Schema(
  {
    name: String, slug: String, sku: String,
    price: Number, priceUnit: String,
    minOrderQty: Number, showInRetail: Boolean,
    category: mongoose.Schema.Types.ObjectId,
    subcategory: mongoose.Schema.Types.ObjectId,
    images: [String],
    productType: String, primaryMaterial: String,
    style: String, setType: String, color: String,
    sizeCategory: String, theme: String, usageArea: String,
    bestSelling: Boolean, newArrival: Boolean,
    description: String,
  },
  { timestamps: true }
);

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error("MONGODB_URI missing"); process.exit(1); }

  await mongoose.connect(uri);
  const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

  // Get all products without SKU, ordered by createdAt
  const products = await Product.find({
    $or: [{ sku: { $exists: false } }, { sku: "" }, { sku: null }]
  }).sort({ createdAt: 1 });

  console.log(`Found ${products.length} products without SKU`);

  // Get current max SKU number
  const withSku = await Product.find({ sku: { $regex: /^RAP-/ } }).sort({ sku: -1 }).limit(1);
  let counter = 1;
  if (withSku.length > 0) {
    const lastNum = parseInt(withSku[0].sku.replace("RAP-", ""), 10);
    if (!isNaN(lastNum)) counter = lastNum + 1;
  }

  let updated = 0;
  for (const prod of products) {
    const sku = `RAP-${String(counter).padStart(3, "0")}`;
    await Product.findByIdAndUpdate(prod._id, { sku });
    console.log(`  ${prod.name} → ${sku}`);
    counter++;
    updated++;
  }

  console.log(`\n✓ Assigned SKU to ${updated} products`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
