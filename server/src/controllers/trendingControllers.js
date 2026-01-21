const trendingData = {
  "men's fashion": ["T-Shirts", "Shirts", "Shoes", "Backpacks", "Wallets", "Sunglasses"],
  "women's fashion": ["Sarees", "Kurtas", "Dresses", "Heels", "Perfumes", "Handbags"],
  "electronics": ["Earbuds", "Smartwatches", "Laptops", "Power Banks", "Speakers"],
  "default": ["Shirts", "Wallets", "Sunglasses", "T-Shirts", "Sarees"]
};

const getTrendingByContext = (req, res) => {
  const { category } = req.query;
  const key = category ? decodeURIComponent(category).toLowerCase() : "default";
  const data = trendingData[key] || trendingData["default"];
  res.json(data);
};

module.exports = { getTrendingByContext };