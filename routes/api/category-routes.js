const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Category, Product, ProductTag, Tag } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
router.get('/', (req, res) => {
  Category.findAll({ include: [Product] })
    .then((categories) => res.json(categories))
    .catch((err) => res.status(500).json(err));
});

// find one category by its `id` value
// be sure to include its associated Products
router.get('/:id', async (req, res) => {
  Category.findOne({ where: { id: req.params.id }, include: [Product] })
    .then((singleCatData) => res.json(singleCatData))
    .catch((err) => res.status(400).json(err));
});

// create a new category
router.post('/', (req, res) => {
  try {
    const newCatData = Category.create({
      product_id: req.body.product_id,
    });
    res.status(200).json(newCatData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
  try {
    const updateCatData = Category.put({
      product_id: req.body.product_id,
    });
    res.status(200).json(updateCatData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete a category by its `id` value
router.delete('/:id', (req, res) => {
  try {
    const catData = Category.destroy({
      where: { id: req.params.id }
    });
    if (!catData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(catData);
  } catch (err) {
    res.response(500).json(err);
  }
});

module.exports = router;
