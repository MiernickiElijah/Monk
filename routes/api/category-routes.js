const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const catData = await Category.findAll({
      include: [{ model: Category }, { model: Product }],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM category AND product = id)'
            ),
            'product'
          ],
        ],
      },
    });
    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one category by its `id` value
// be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const singleCat = await Category.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Product }],
      attributes: {
        include: [
          [
            // Use plain SQL to get a count of all short books
            sequelize.literal(
              '(SELECT COUNT(*) FROM category AND product = id)'
            ),
            'shortBooks',
          ],
        ],
      },
    });
    if (!singleCat) {
      res.status(404).json({ message: 'No Category found with that id!' });
      return;
    }
    res.status(200).json(singleCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  try {
    const newCatData = await Category.create({
      product_id: req.body.product_id,
    });
    res.status(200).json(newCatData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  try {
    const updateCatData = await Category.create({
      product_id: req.body.product_id,
    });
    res.status(200).json(updateCatData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  try {
    const catData = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!catData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
