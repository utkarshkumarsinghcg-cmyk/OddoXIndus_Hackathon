import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProductForm({ isEdit = false }) {
    const navigate = useNavigate();
    const location = useLocation();
    const existingProduct = location.state?.product;

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        uom: '',
        stock: '',
        warehouse: '',
    });

    useEffect(() => {
        if (isEdit && existingProduct) {
            setFormData(existingProduct);
        }
    }, [isEdit, existingProduct]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Simulate save
        navigate('/products');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {isEdit ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Complete the form to {isEdit ? 'update' : 'create'} the product record.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleSave}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md sm:text-sm border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">SKU Code</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        required
                                        value={formData.sku}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md sm:text-sm border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Category...</option>
                                        <option value="Raw Materials">Raw Materials</option>
                                        <option value="Hardware">Hardware</option>
                                        <option value="Consumables">Consumables</option>
                                    </select>
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Unit of Measure</label>
                                    <input
                                        type="text"
                                        name="uom"
                                        value={formData.uom}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md sm:text-sm border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md sm:text-sm border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="w-full md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Warehouse</label>
                                    <select
                                        name="warehouse"
                                        required
                                        value={formData.warehouse}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Warehouse...</option>
                                        <option value="Main Warehouse">Main Warehouse</option>
                                        <option value="Local Store 1">Local Store 1</option>
                                        <option value="Paint Facility">Paint Facility</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-5 mt-5 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-end gap-3 space-y-3 sm:space-y-0">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/products')}
                                        className="w-full sm:w-auto bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Save Product
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
