import React, { useEffect, useRef, useMemo, useCallback } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

const sampleData = [
  { id: 1, name: "John Doe", age: 28, city: "New York" },
  { id: 2, name: "Jane Smith", age: 32, city: "Los Angeles" },
  { id: 3, name: "Sam Wilson", age: 25, city: "Chicago" },
  { id: 4, name: "Chris Evans", age: 35, city: "Houston" },
  { id: 5, name: "Chris Evans", age: 35, city: "Houston" }, //Duplicate
  { id: 6, name: "Alice Brown", age: 29, city: "Seattle" },
];

/**
 * @author Swaroop Chakraborty
 * @description: A reusable data table component with column-wise dropdown filters.
 * This component can be customized with various table data and styling configuration props to fit different use cases.
 * Table Rendition Powered by DataTables(https://datatables.net/)
 * @date February 24, 2025
 */
const DataTableComponent = ({
  id = null,
  title = "Data Table with Column Wise Drop Down Filters",
  subtitle = "Reusable data table react component enabled with custom configuration",
  data = sampleData,
  searchPlaceholder = "Search...",
  config = {}, //Table data configuration
  style = {}, //Table Styles configuration
}) => {
  const tableRef = useRef(null);

  //Memoization of the table style to prevent useless re-rendering
  const defaultStyle = useMemo(
    () => ({
      className: "table table-striped table-bordered",
      columnFilterClassName: "form-select form-select-sm",
      width: "100%",
      ...style,
    }),
    [style]
  );
  //Memoization of the table config to prevent useless re-rendering
  const defaultConfig = useMemo(
    () => ({
      paging: true,
      searching: true,
      ordering: true,
      lengthChange: false,
      pageLength: 5,
      order: [],
      footer:true,
      stateSave: false, // Ensures memoization of filters and pagination, only set to true if you want the browser to remember the state of the last search filter applied even on page refresh.
      language: {
        // All message controls for the table
        searchPlaceholder,
        search: "",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        emptyTable: "No data available in the table",
        zeroRecords: "No matching records found",
        footer_text: <>Powered by <a rel="noreferrer" target="_blank" href='https://datatables.net/'>DataTables</a></>,
      },

      ...config, //Add up any other custom configuration for table
    }),
    [config, searchPlaceholder]
  );
  const initializeColumnFilters = useCallback(
    (api) => {
      api.columns().every(function (colIdx) {
        const column = this;

        const columnKey = `column_filter_${colIdx}`;
        const savedFilter = defaultConfig.stateSave
          ? localStorage.getItem(columnKey) || ""
          : "";
        // Creating a drop down component for each header column
        const select = $(
          `<select class='${defaultStyle.columnFilterClassName}'><option value="">---All---</option></select>`
        )
          .appendTo($(column.header()).empty())
          .on("click", (e) => e.stopPropagation()) // Prevent auto sorting when interacting with column filter select dropdown on each column
          // Setting up the on change event to fire search event on change of option in the select drop down for each column
          .on("change", function () {
            const val = $.fn.dataTable.util.escapeRegex($(this).val());
            column.search(val ? `^${val}$` : "", true, false).draw();
            if (defaultConfig.stateSave) localStorage.setItem(columnKey, val);
          });

        column
          .data()
          .unique()
          .sort()
          // Sorting and Setting the options value for each unique data (d) item with respect to the respective columns
          .each((d) => {
            select.append(`<option value="${d}">${d}</option>`);
          });
        // Restore Dropdown Selection
        if (defaultConfig.stateSave) {
          select.val(savedFilter);
          if (savedFilter) column.search(savedFilter).draw();
        }

        return true;
      });
    },
    [defaultConfig.stateSave, defaultStyle.columnFilterClassName]
  );

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      // Setting the configuration
      ...defaultConfig,
      // Initialize the data table library api upon the table reference of 'tableRef' as and when it becomes available in the DOM
      initComplete: function () {
        initializeColumnFilters(this.api());
      },
    });

    return () => {
      table.destroy();
    };
  }, [defaultConfig, initializeColumnFilters]);
  if (!data) return <></>;
  return (
    <div className="container mt-4">
      {/* Title of table */}
      {title && <h2 className="mb-3 fs-3">{title}</h2>}
      {/* Sub title of table */}
      {subtitle && <h5 className="mb-3 fs-6 text-muted">{subtitle}</h5>}

      <table
        id={id}
        ref={tableRef}
        className={defaultStyle.className}
        style={{ width: defaultStyle.width }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {defaultConfig.footer && defaultConfig.language.footer_text && (
        <footer className="text-center small">
          {defaultConfig.language.footer_text}
        </footer>
      )}
    </div>
  );
};

export default DataTableComponent;
