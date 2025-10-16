import React, { useEffect, useMemo, useState } from "react";

/**
 * DynamicProductTable.jsx
 * - Server-driven React component (Tailwind CSS styles)
 * - Actions are displayed in a per-row icon dropdown (kebab/menu) with nice icons.
 * - Props (server-driven): data, total, page, rowsPerPage, onPageChange, onRowsPerPageChange,
 *   onSearch, onSort, onSelectionChange, columns, actions, headerColor, selectable
 *
 * Action config (example):
 * [
 *   { key: 'view', label: 'View', icon: (props)=><svg.../>, onClick: (row)=>..., showIf: r=>true },
 *   { key: 'edit', label: 'Edit', icon: (props)=><svg.../>, onClick: (row)=>... }
 * ]
 */

export default function DynamicProductTable({
  data = [],
  total = 0,
  page = 1,
  rowsPerPage = 10,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  onSearch = () => {},
  onSort = () => {},
  onSelectionChange = () => {},
  columns = null,
  actions = null,
  headerColor = "bg-gradient-to-r from-sky-600 to-cyan-500",
  selectable = true,
  rowsPerPageOptions = [5, 10, 25, 50],
}) {
  const defaultColumns = [
    { key: "sku", label: "SKU", width: 140, sortable: true },
    { key: "name", label: "Product Name", width: 360, sortable: true },
    { key: "category", label: "Category", width: 180, sortable: true },
    { key: "price", label: "Price", width: 120, sortable: true },
    { key: "stock", label: "Stock", width: 120, sortable: true },
    { key: "createdAt", label: "Created", width: 180, sortable: true, format: (v) => new Date(v).toLocaleDateString() },
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
      onClick: (row) => alert(`View ${row._id}`),
      showIf: () => true,
    },
    {
      key: "edit",
      label: "Edit",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h6M4 7v12a2 2 0 002 2h12" />
        </svg>
      ),
      onClick: (row) => alert(`Edit ${row._id}`),
      showIf: () => true,
    },
  ];

  const colConfig = columns && Array.isArray(columns) ? columns : defaultColumns;
  const actionConfig = actions && Array.isArray(actions) ? actions : defaultActions;

  const [visibleCols, setVisibleCols] = useState(() => colConfig.map((c) => c.key));
  const [colWidths, setColWidths] = useState(() => {
    const map = {};
    colConfig.forEach((c) => (map[c.key] = c.width || 160));
    return map;
  });
  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState({ key: null, dir: 1 });
  const [selected, setSelected] = useState(new Set());
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  // track which row's dropdown is open (store _id or null)
  const [openActionFor, setOpenActionFor] = useState(null);

  useEffect(() => {
    setSelectAllOnPage(() => data.length > 0 && data.every((r) => selected.has(String(r._id))));
  }, [data, selected]);

  useEffect(() => onSelectionChange(Array.from(selected)), [selected]);

  function toggleSelect(id) {
    const s = new Set(selected);
    const sid = String(id);
    if (s.has(sid)) s.delete(sid);
    else s.add(sid);
    setSelected(s);
  }

  function toggleSelectAllOnPage() {
    const s = new Set(selected);
    const pageIds = data.map((r) => String(r._id));
    if (!selectAllOnPage) pageIds.forEach((id) => s.add(id));
    else pageIds.forEach((id) => s.delete(id));
    setSelected(s);
    setSelectAllOnPage(!selectAllOnPage);
  }

  function toggleColumn(key) {
    setVisibleCols((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  }

  function setWidth(key, width) {
    setColWidths((w) => ({ ...w, [key]: width }));
  }

  function handleSort(key) {
    setSortBy((s) => {
      const next = s.key === key ? { key, dir: s.dir * -1 } : { key, dir: 1 };
      onSort && onSort(next);
      return next;
    });
  }

  function getColMeta(key) {
    return colConfig.find((c) => c.key === key) || { key, label: key };
  }

  function renderCell(row, key) {
    const meta = getColMeta(key);
    const val = row[key];
    if (meta.format) return meta.format(val, row);
    if (key === "price") return typeof val === "number" ? `₹${val.toFixed(2)}` : val;
    return String(val ?? "-");
  }

  function handlePageInput(v) {
    const p = Number(v) || 1;
    onPageChange(Math.max(1, p));
  }

  function handleRowsPerPageChange(v) {
    onRowsPerPageChange(Number(v));
  }

  function handleSearchInput(v) {
    setLocalSearch(v);
    onSearch(v);
  }

  // close dropdown when clicking outside - simple listener
  useEffect(() => {
    function onDocClick(e) {
      // if click outside any open dropdown, close it
      if (!(e.target instanceof Element)) return;
      if (e.target.closest(".action-dropdown")) return; // inside dropdown
      setOpenActionFor(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const Header = (
    <div className={`rounded-t-lg p-4 flex items-center justify-between gap-4 ${headerColor} text-white`}>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/20 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Products</h3>
          <p className="text-sm opacity-90">Showing {total} products — page {page}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/8 rounded-md p-1">
          <input
            className="bg-transparent outline-none px-2 py-1 text-white placeholder-white/80"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
          <button className="text-sm px-3 py-1 rounded-md border border-white/20" onClick={() => handleSearchInput("")}>Clear</button>
        </div>

        <button
          className="px-3 py-2 bg-white text-slate-800 rounded-md shadow-sm"
          onClick={() => setShowColumnPanel((v) => !v)}
        >
          Columns
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {Header}

      {showColumnPanel && (
        <div className="p-4 border-b flex gap-6 items-start">
          <div className="min-w-[260px]">
            <h4 className="font-semibold mb-2">Visible columns</h4>
            <div className="grid grid-cols-1 gap-2">
              {colConfig.map((c) => (
                <label key={c.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={visibleCols.includes(c.key)} onChange={() => toggleColumn(c.key)} />
                  <span className="text-sm">{c.label}</span>
                  <span className="ml-auto text-xs opacity-70">{colWidths[c.key]}px</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h4 className="font-semibold mb-2">Column widths (quick adjust)</h4>
            <div className="flex gap-3 flex-wrap">
              {visibleCols.map((k) => (
                <div key={k} className="w-56 border rounded-md p-3 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{getColMeta(k).label}</div>
                    <div className="ml-auto text-xs opacity-70">{colWidths[k]}px</div>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="600"
                    value={colWidths[k]}
                    onChange={(e) => setWidth(k, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y table-fixed">
          <thead>
            <tr className="text-sm text-slate-700">
              {selectable && (
                <th className="w-12 px-3 py-3 text-left">
                  <input type="checkbox" checked={selectAllOnPage} onChange={toggleSelectAllOnPage} />
                </th>
              )}

              {visibleCols.map((key) => (
                <th key={key} style={{ width: colWidths[key] }} className="px-4 py-3 text-left align-middle">
                  <div className="flex items-center gap-2">
                    <button className="flex-1 text-sm font-medium" onClick={() => getColMeta(key).sortable && handleSort(key)}>
                      {getColMeta(key).label}
                    </button>
                    {sortBy.key === key && <span className="text-xs">{sortBy.dir === 1 ? "▲" : "▼"}</span>}
                  </div>
                </th>
              ))}

              {actionConfig && actionConfig.length > 0 && <th className="w-16 px-4 py-3 text-left"> </th>}
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {data.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                {selectable && (
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selected.has(String(row._id))} onChange={() => toggleSelect(row._id)} />
                  </td>
                )}

                {visibleCols.map((key) => (
                  <td key={key} className="px-4 py-3 align-top">
                    <div className="text-sm font-medium">{renderCell(row, key)}</div>
                    {key === "name" && row.subtitle && <div className="text-xs opacity-70">{row.subtitle}</div>}
                  </td>
                ))}

                {actionConfig && (
                  <td className="px-2 py-3 align-top">
                    {/* Icon button opens dropdown */}
                    <div className="relative inline-block text-left action-dropdown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionFor((o) => (o === String(row._id) ? null : String(row._id)));
                        }}
                        className="p-2 rounded-md hover:bg-slate-100 border"
                        aria-haspopup="true"
                        aria-expanded={openActionFor === String(row._id)}
                      >
                        {/* kebab icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {openActionFor === String(row._id) && (
                        <div className="absolute right-0 mt-2 w-44 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {actionConfig.map((a) => {
                              try {
                                if (a.showIf && !a.showIf(row)) return null;

                                // If user provided render and it's a full custom element, show it inside the menu
                                if (a.render && typeof a.render === "function") {
                                  return (
                                    <div key={a.key} className="px-3 py-2 hover:bg-slate-50 text-sm">
                                      {a.render(row)}
                                    </div>
                                  );
                                }

                                // otherwise render a menu item that calls onClick
                                return (
                                  <button
                                    key={a.key}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionFor(null);
                                      if (a.onClick) a.onClick(row);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm"
                                  >
                                    {a.icon ? <span className="opacity-80">{a.icon({})}</span> : null}
                                    <span>{a.label}</span>
                                  </button>
                                );
                              } catch (err) {
                                return null;
                              }
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={visibleCols.length + (selectable ? 1 : 0) + (actionConfig ? 1 : 0)} className="p-8 text-center text-sm text-slate-500">
                  No products on this page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex items-center justify-between gap-4 border-t">
        <div className="flex items-center gap-3">
          <div className="text-sm">Rows per page:</div>
          <select value={rowsPerPage} onChange={(e) => handleRowsPerPageChange(e.target.value)} className="px-2 py-1 border rounded-md">
            {rowsPerPageOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <div className="text-sm opacity-80">Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, total)} of {total}</div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded-md border" onClick={() => onPageChange(1)} disabled={page === 1}>First</button>
          <button className="px-2 py-1 rounded-md border" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>

          <div className="px-3 py-1 border rounded-md">Page</div>
          <input
            className="w-12 text-center rounded-md border px-1"
            value={page}
            onChange={(e) => handlePageInput(e.target.value)}
          />

          <button className="px-2 py-1 rounded-md border" onClick={() => onPageChange(Math.min(Math.ceil(total / rowsPerPage), page + 1))} disabled={page >= Math.ceil(total / rowsPerPage)}>Next</button>
          <button className="px-2 py-1 rounded-md border" onClick={() => onPageChange(Math.ceil(total / rowsPerPage))} disabled={page >= Math.ceil(total / rowsPerPage)}>Last</button>
        </div>
      </div>
    </div>
  );
}
