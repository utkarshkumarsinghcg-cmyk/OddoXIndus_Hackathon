import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../services/api';
import DataTable from '../../components/DataTable';
import SearchBar from '../../components/SearchBar';
import Filters from '../../components/Filters';
import { Plus } from 'lucide-react';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data);
    };

    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            setProducts(products.filter((p) => p.id !== row.id));
        }
    };

    const handleEdit = (row) => {
        navigate(`/products/edit/${row.id}`, { state: { product: row } });
    };

    const filteredProducts = products.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter ? p.category === categoryFilter : true;
        const matchWarehouse = warehouseFilter ? p.warehouse === warehouseFilter : true;
        return matchSearch && matchCategory && matchWarehouse;
    });

    const columns = [
        { header: 'Product Name', accessor: 'name' },
        { header: 'SKU', accessor: 'sku' },
        { header: 'Category', accessor: 'category' },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Warehouse', accessor: 'warehouse' },
    ];

    const categories = ['Raw Materials', 'Hardware', 'Consumables'];
    const warehouses = ['Main Warehouse', 'Local Store 1', 'Paint Facility'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 shadow-sm p-2 rounded bg-white w-full border-b">Product Management</h1>
            </div>

            <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1 w-full md:max-w-md shadow-sm">
                        <SearchBar value={search} onChange={setSearch} placeholder="Search by SKU or Name" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <Filters label="Category" options={categories} value={categoryFilter} onChange={setCategoryFilter} />
                        <Filters label="Warehouse" options={warehouses} value={warehouseFilter} onChange={setWarehouseFilter} />
                        <div className="flex w-full md:w-auto items-end mt-4 md:mt-0">
                            <Link
                                to="/products/add"
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add Product
                            </Link>
                        </div>
                    </div>
                </div>

                <DataTable columns={columns} data={filteredProducts} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </div>
    );
}
