const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: ProductTag }, { model: Product }],
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
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const singleTag = await Tag.findByPk(req.params.id, {
      include: [{ model: ProductTag }, { model: Product }],
      attributes: {
        include: [
          [
            // Use plain SQL to get a count of all short books
            sequelize.literal(
              '(SELECT COUNT(*) FROM category AND product = id)'
            ),
            'product',
          ],
        ],
      },
    });
    if (!singleTag) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.status(200).json(singleTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  try {
    const newCatData = await Tag.create({
      product_id: req.body.product_id,
    });
    res.status(200).json(newCatData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTagData = await Tag.put({
      product_id: req.body.product_id,
    });
    res.status(200).json(updateTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
