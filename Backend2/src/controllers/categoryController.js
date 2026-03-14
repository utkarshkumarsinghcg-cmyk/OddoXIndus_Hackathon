const categoryService = require('../services/categoryService');

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400);
      throw new Error('Please add a category name');
    }
    const category = await categoryService.createCategory(name, description);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
};
