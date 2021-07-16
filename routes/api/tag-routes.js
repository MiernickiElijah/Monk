const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// find all tags
// be sure to include its associated Product data
router.get('/', (req, res) => {
  Tag.findAll({ include: [{ through: ProductTag, model: Product }] })
    .then((tags) => res.json(tags))
    .catch((err) => res.status(400).json(err));
});


// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', (req, res) => {
  Tag.findOne({ where: { id: req.params.id }, include: [Product] })
    .then((singleTagData) => res.json(singleTagData))
    .catch((err) => res.status(400).json(err));
});

router.post('/', (req, res) => {
  // create a new tag
  try {
    const newTagData = Tag.create({
      product_id: req.body.product_id,
    });
    res.status(200).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTagData = Tag.put({
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
    const tagData = Tag.destroy({
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
