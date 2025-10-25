import React, { useEffect, useState } from "react";
import DynamicProductTable from "../../components/table/table";
import { getProducts } from "../../api/services/product/productApi";
import { useNavigate } from 'react-router-dom';

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
      onClick: (row) => handleView(row),
      showIf: () => true,
    },
  ];


  const handleEdit = (row) => {
    console.log("row", row);
  };

  return (
    <div>
      <div>
        <DynamicProductTable
          data={products}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => setPage(p)}
          onRowsPerPageChange={(r) => setRowsPerPage(r)}
          onSearch={() => {}}
          onSort={() => {}}
          onSelectionChange={() => {}}
          actions={defaultActions}
        />
      </div>
    </div>
  );
}
