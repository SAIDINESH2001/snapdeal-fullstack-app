const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URI = "mongodb+srv://saidineshsuri2001_db_user:n1IZ0KOPfeaCO24J@snapdeal-products.hf8v8nk.mongodb.net/";
const DB_NAME = "SnapDeal_ECommerce";
const COLLECTION = "products";


const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function addCounts() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const col = client.db(DB_NAME).collection(COLLECTION);

  const matchQuery = {
    product_rating: { $type: "number" },
    overall_rating: { $type: "number" },
    $or: [
      { ratings_count: { $exists: false } },
      { reviews_count: { $exists: false } }
    ]
  };

  const total = await col.countDocuments(matchQuery);
  console.log(`Products to update: ${total}`);

  if (total === 0) {
    console.log("Nothing to process. Exiting.");
    await client.close();
    return;
  }

  let lastId = null;
  let processed = 0;
  const BATCH_SIZE = 200;

  while (true) {
    const query = lastId
      ? { ...matchQuery, _id: { $gt: lastId } }
      : matchQuery;

    const docs = await col
      .find(query)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .toArray();

    if (docs.length === 0) break;

    for (const product of docs) {
      console.log(
        `Updating PID: ${product.pid || "N/A"} | _id: ${product._id}`
      );

      const ratingsCount = rand(10, 500);
      const reviewsCount = rand(
        Math.floor(ratingsCount * 0.4),
        ratingsCount
      );

      await col.updateOne(
        { _id: product._id },
        {
          $set: {
            ratings_count: ratingsCount,
            reviews_count: reviewsCount,
            counts_initialized: true
          }
        }
      );

      processed++;
      lastId = product._id;
    }
  }

  console.log(`DONE. Total updated: ${processed}`);
  await client.close();
}

addCounts().catch(err => {
  console.error("FAILED:", err);
  process.exit(1);
});