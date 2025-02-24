import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive";
import { v4 as uuidv4 } from "uuid";

const sampleData = [
  { id: 1, name: "John Doe", age: 28, city: "New York" },
  { id: 2, name: "Jane Smith", age: 32, city: "Los Angeles" },
  { id: 3, name: "Sam Wilson", age: 25, city: "Chicago" },
  { id: 4, name: "Chris Evans", age: 35, city: "Houston" },
  { id: 5, name: "Chris Evans", age: 35, city: "Houston" }, // Duplicate
  { id: 6, name: "Alice Brown", age: 29, city: "Seattle" },
  { name: "Jane Doe", age: 29, city: "Seattle" }, // This will not qualify as a column key is missing
];

const sampleColumns = [
  { key: "id", name: "ID" },
  { key: "name", name: "Name" },
  { key: "age", name: "Age" },
  { key: "city", name: "City" },
];

const DataTableComponent = ({
  id = null,
  title = "Data Table with Column Wise Drop Down Filters",
  subtitle = "Reusable data table react component enabled with custom configuration",
  data = sampleData,
  columns = sampleColumns,
  searchPlaceholder = "Search...",
  config = {}, // Table data configuration
  style = {}, // Table Styles configuration
  onSelect = () => {}, // Function prop invoked when a column is selected, you can choose to perform any custom action based on selection
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const tableRef = useRef(null);

  const defaultStyle = useMemo(
    () => ({
      className: "table table-striped table-bordered",
      columnFilterClassName: "form-select form-select-sm",
      width: "100%",
      ...style,
    }),
    [style]
  );

  const defaultConfig = useMemo(
    () => ({
      paging: true,
      searching: true,
      columnFilter: true, // Enables columnwise filtering if true
      ordering: true,
      lengthChange: true,
      lengthMenu: [
        [5, 10, 25, 50, 100],
        [5, 10, 25, 50, 100],
      ],
      pageLength: 5,
      order: [],
      fixedHeader: true, // Allows the header to be fixed if set to true
      footer: true,
      selectable: true, // Lets you select the table rows and do stuff with them, e.g. edit, delete operations
      responsive: true, // Keeps the table responsive on a variety of screens even on mobile devices
      stateSave: false, // Ensures memoization of filters and pagination, only set to true if you want the browser to remember the state of the last search filter applied even on page refresh.
      language: {
        // All message controls for the table
        searchPlaceholder,
        search: "",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        infoEmpty: "Showing 0 to 0 of 0 entries",
        emptyTable: "No data available in the table",
        zeroRecords: "No matching records found",
        footer_text: (
          <>
            Powered by{" "}
            <a rel="noreferrer" target="_blank" href="https://datatables.net/">
              DataTables
            </a>
          </>
        ),
      },

      ...config, // Add up any other custom configuration for table
    }),
    [config, searchPlaceholder]
  );

  const filteredData = useMemo(() => {
    const uniqueIds = new Set();
    return data
      .map((item) => {
        const id = item.id || uuidv4();
        if (uniqueIds.has(id)) {
          // Remove the duplicate entry from the data array
          const index = data.findIndex((dataItem) => dataItem.id === id);
          if (index !== -1) {
            data.splice(index, 1);
          }
          return null; // Return null to remove the duplicate entry
        }
        uniqueIds.add(id);
        return { ...item, id };
      })
      .filter((item) => item !== null) // Filter out null values which represent duplicate entries
      .filter((item) => {
        const keys = Object.keys(item);
        // Allow only those data items which have the same number of keys as the columns
        return (
          columns.length === keys.length &&
          columns.every((col, index) => col.key === keys[index])
        );
      });
  }, [data, columns]);

  const initializeColumnFilters = useCallback(
    (api) => {
      api.columns().every(function (colIdx) {
        let adjustedColIdx = colIdx;
        if (defaultConfig.selectable) {
          adjustedColIdx -= 1; // Shift index to right if checkbox column is present
          if (adjustedColIdx < 0) return true; // Skip the checkbox column
        }
        const column = this;
        const colName = columns[adjustedColIdx]?.name || "";
        const columnKey = `column_filter_${adjustedColIdx}`;
        const savedFilter = defaultConfig.stateSave
          ? localStorage.getItem(columnKey) || ""
          : "";

        const header = $(column.header()).empty();
        header.append(
          `<span class='text-start text-truncate d-block' style="max-width:150px;">${colName}</span>`
        );
        // Creating a drop down component for each header column
        const select = $(
          `<select class='${defaultStyle.columnFilterClassName}'><option value="">---All---</option></select>`
        )
          .appendTo(header)
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
            select.append(`<option class='small' value="${d}">${d}</option>`);
          });
        // Restore Dropdown Selection
        if (defaultConfig.stateSave) {
          select.val(savedFilter);
          if (savedFilter) column.search(savedFilter).draw();
        }

        return true;
      });
    },
    [
      columns,
      defaultConfig.selectable,
      defaultConfig.stateSave,
      defaultStyle.columnFilterClassName,
    ]
  );

  useEffect(() => {
    const columnDefs = defaultConfig.selectable
      ? [
          {
            targets: 0, // First column (Select column)
            orderable: false, // Disable sorting on select column
            className: "dt-body-center",
          },
        ]
      : [];
    const table = $(tableRef.current).DataTable({
      // Setting the configuration
      ...defaultConfig,
      columnDefs,
      // Initialize the data table library api upon the table reference of 'tableRef' as and when it becomes available in the DOM
      initComplete: function () {
        if (defaultConfig.columnFilter) {
          initializeColumnFilters(this.api());
        }
      },
    });

    // Display all visible columns in the table
    table.columns().every(function () {
      $(this.header()).css("display", "");
      return true;
    });

    return () => {
      table.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultConfig, filteredData, initializeColumnFilters]);

  const handleRowSelection = (item) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.some((row) => row?.id === item?.id);
      const newSelection = isSelected
        ? prevSelected.filter((row) => row?.id !== item?.id)
        : [...prevSelected, item];
      onSelect(newSelection);
      console.log("Selectd rows:", newSelection);
      return newSelection;
    });
  };

  useEffect(() => {
    $(tableRef.current)
      .find("tbody tr")
      .each(function () {
        const id = parseInt($(this).find("td").eq(1).text(), 10);
        if (selectedRows.some((row) => row?.id === id)) {
          $(this).addClass("table-primary");
        } else {
          $(this).removeClass("table-primary");
        }
      });
  }, [selectedRows]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowsSelected = filteredData.map((item) => item);
      setSelectedRows(allRowsSelected);
    } else {
      setSelectedRows([]);
    }
  };

  if (!data) return <></>;
  return (
    <div className="container mt-4">
      {/* Title of table */}
      {title && (
        <h2
          className="mb-3 fs-3 text-start text-truncate"
          style={{ maxWidth: "700px" }}
        >
          {title}
        </h2>
      )}
      {/* Sub title of table */}
      {subtitle && (
        <h5
          className="mb-3 fs-6 text-muted text-start text-truncate"
          style={{ maxWidth: "600px" }}
        >
          {subtitle}
        </h5>
      )}
      <div className={defaultConfig.responsive && "table-responsive"}>
        {defaultConfig.selectable && filteredData.length > 0 && (
          <div className="form-check mb-2 ">
          <input
            id="select-all"
            type="checkbox"
            checked={
              selectedRows && selectedRows.length === filteredData.length
            }
            onChange={(e) => toggleSelectAll(e)}
            className="form-check-input row-select dt-body-center mr-2"
          />
          <label className="form-check-label small" htmlFor="select-all">Select all</label>
        </div>
        )}
        <table
          id={id}
          ref={tableRef}
          className={defaultStyle.className}
          style={{ width: defaultStyle.width }}
        >
          {/* Dynamic cols */}
          {columns && (
            <thead>
              <tr>
                {defaultConfig.selectable && (
                  <th className="bg-secondary dt-body-center"></th>
                )}
                {columns.map((col) => (
                  <th key={col.key}>{col.name}</th>
                ))}
              </tr>
            </thead>
          )}
          {/* Dynamic data */}
          {filteredData && (
            <tbody>
              {filteredData.map((item, index) => {
                const isSelected = selectedRows.some(
                  (row) => row?.id === item?.id
                );

                return (
                  <tr
                    key={index}
                    className={isSelected ? "table-primary" : ""}
                    onClick={() => handleRowSelection(item)}
                  >
                    {/* Add checkbox column if selectable */}
                    {defaultConfig.selectable && (
                      <td
                        className="dt-body-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          onChange={() => handleRowSelection(item)}
                          className="row-select dt-body-center"
                          checked={isSelected}
                          data-id={item.id}
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td key={col.key} className="text-truncate">
                        {item[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {defaultConfig.footer && defaultConfig.language.footer_text && (
        <footer className="text-center small">
          {defaultConfig.language.footer_text}
        </footer>
      )}
    </div>
  );
};

export default DataTableComponent;
