import React, { useEffect, useState } from "react";
import DynamicProductTable from "../../components/table/table";
import { getProducts } from "../../api/services/product/productApi";
import { useNavigate } from 'react-router-dom';
import Modal from "../../components/modal/modal";
import BarcodePreview from "../../components/barcode/";

export default function AllProducts() {
  // total = 0,
  // page = 1,
  // rowsPerPage = 10,
  // onPageChange = () => {},
  // onRowsPerPageChange = () => {},
  // onSearch = () => {},
  // onSort = () => {},
  // onSelectionChange = () => {},
  

  const navigate = useNavigate();
  const [products, setProducts] = useState();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [barcode, setBarcode] = useState();

  const [open, setOpen] = useState(false);
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage]);

  const getData = async () => {
    const response = await getProducts({
      page: page,
      limit: rowsPerPage,
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    console.log("response", response.data);

    setProducts(response.data.data);
    setTotal(response.data.total);
    setPage(response.data.page);
    // setRowsPerPage(response.data.limit);
  };

  const handleView=(row)=>{
      navigate(`/product/${row.slug}`);
  }

  const defaultColumns = [
    { key: "sku", label: "SKU", width: 96, sortable: true , format: (v) => 
    { return <span className="cursor-pointer" onClick={() => {handleOpen(); setBarcode(v);}}>{v}</span>} },
    { key: "barcode", label: "Barcode", width: 112, sortable: true , format: (v) => 
    { return <span className="cursor-pointer" onClick={() => {handleOpen(); setBarcode(v);}}>{v}</span>} },
    // { key: "barcode", label: "Barcode", width: 140, sortable: true },
    { key: "name", label: "Product Name", width: 240, sortable: true },
    { key: "category", label: "Category", width: 120, sortable: true },
    { key: "mrp", label: "MRP", width: 92, sortable: true, format: (v) => formatCurrency(v) },
    { key: "sellingPrice", label: "Selling Price", width: 116, sortable: true, format: (v) => formatCurrency(v) },
    { key: "stockQty", label: "Stock", width: 84, sortable: true, format: (v) => (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${Number(v) <= 10 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
        {v ?? 0}
      </span>
    ) },
    { key: "createdAt", label: "Created", width: 108, sortable: true, format: (v) => new Date(v).toLocaleDateString() },
  ];


  const defaultActions = [
    {
      key: "view",
      label: "View",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: (row) => handleView(row),
      showIf: () => true,
    },
    {
      key: "sell",
      label: "Sell",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: (row) => navigate(`/sell/${row.slug}`),
      showIf: () => true,
    },
    {
      key: "edit",
      label: "Edit",
      // icon: () => (
      //   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h6M4 7v12a2 2 0 002 2h12" />
      //   </svg>
      // ),
      // onClick: (row) => alert(`Edit ${row._id}`),
      // onClick: (row) => handleEdit(row),
      onClick: (row) => handleEdit(row),
      showIf: () => true,
    },
  ];


  const handleEdit = (row) => {
    
    navigate(`/updateProduct/${row._id}`);
    
  };

  return (
    <div className="w-full max-w-none space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sky-700 mb-1">Catalog</p>
          <h1 className="text-2xl font-bold text-slate-950">Product Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Review stock, pricing, barcodes, and product actions.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/addProduct")}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Add Product
        </button>
      </div>

      <DynamicProductTable
        data={products}
        total={total}
        columns={defaultColumns}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(p) => setPage(p)}
        onRowsPerPageChange={(r) => setRowsPerPage(r)}
        onSearch={() => {}}
        onSort={() => {}}
        onSelectionChange={() => {}}
        actions={defaultActions}
      />

      <Modal open={open} handleClose={handleClose} title="Product Barcode" content={<BarcodePreview value={barcode} />} />
    </div>
  );
}
