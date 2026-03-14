const prisma = require('../prisma');

const createProduct = async (name, sku, unit, stock, categoryId) => {
  // Check if sku exists
  const skuExists = await prisma.product.findUnique({ where: { sku } });
  if (skuExists) {
    throw new Error('Product with this SKU already exists');
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      unit,
      stock,
      categoryId,
    },
    include: {
      category: true,
    },
  });

  return product;
};

const getProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return products;
};

const updateProduct = async (id, data) => {
  const productExists = await prisma.product.findUnique({ where: { id: Number(id) } });

  if (!productExists) {
    throw new Error('Product not found');
  }

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data,
    include: {
      category: true,
    },
  });

  return product;
};

const deleteProduct = async (id) => {
  const productExists = await prisma.product.findUnique({ where: { id: Number(id) } });

  if (!productExists) {
    throw new Error('Product not found');
  }

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return { message: 'Product deleted successfully' };
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
