const prisma = require('../prisma');

const createCategory = async (name, description) => {
  const categoryExists = await prisma.category.findFirst({ where: { name } });
  if (categoryExists) {
    throw new Error('Category with this name already exists');
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return category;
};

const getCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return categories;
};

module.exports = {
  createCategory,
  getCategories,
};
