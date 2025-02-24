# DataTableComponent

The DataTableComponent is a reusable React component designed to display data in a table format with additional features such as column-wise dropdown filters and customizable configurations. This component is built using React, jQuery, and Bootstrap, and can be easily integrated into any React project.

## Features

- **Column-wise Filters**: Enable filtering on each column.
- **Search Functionality**: Allows searching within the table.
- **Paging**: Supports pagination.
- **Ordering**: Supports sorting.
- **Fixed Header**: Allows the header to be fixed.
- **Responsive**: Ensures the table is responsive on various screens.
- **Selectable Rows**: Enables row selection for additional actions.
- **Custom Configuration**: Flexible configuration options.

## Installation

```bash
npm install react-data-table-component
```

## Usage

```jsx
import React from 'react';
import DataTableComponent from 'react-data-table-component';

const sampleData = [
  { id: 1, name: 'John Doe', age: 30, city: 'New York' },
  { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  // // Add more data as needed, this is ideally the response JSON array of your api

const sampleColumns = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Name' },
  { key: 'age', name: 'Age' },
  { key: 'city', name: 'City' },
];
// The key values in the columns array must be of the same name as your data object keys
// The length of the columns array must be equal to the number of unique keys in your data object.
// The name values in the columns array is free-form and can have any value, it will be used to display the column name of the table.

const App = () => {
  return (
    <div>
      <DataTableComponent
        //Optional props
        id="data-table"
        title="Data Table with Column Wise Drop Down Filters"
        subtitle="Reusable data table react component enabled with custom configuration"
        //Optional props

        //Required props
        data={sampleData}
        columns={sampleColumns}
        //Required props

        //Optional props
        searchPlaceholder="Search..."
        config={{
          paging: true,
          searching: true,
          columnFilter: true,
          ordering: true,
          lengthChange: true,
          lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
          pageLength: 5,
          order: [],
          fixedHeader: true,
          footer: true,
          selectable: true,
          responsive: true,
          stateSave: false,
          language: {
            searchPlaceholder: "Search...",
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
          //Optional props
        }}
      />
    </div>
  );
};

export default App;
```

## Props

| Prop                    | Description                                                                 | Type                 | Default |
|-------------------------|-----------------------------------------------------------------------------|----------------------|---------|
| `id`                    | Unique identifier for the table[Optional].                                            | `string`             | `null`  |
| `title`                 | Title of the table[Optional].                                                        | `string`             | `""`    |
| `subtitle`              | Subtitle of the table[Optional].                                                     | `string`             | `""`    |
| `data`                  | Array of data objects to be displayed in the table.                        | `Array`              | `[]`    |
| `columns`               | Array of column objects defining the table structure.                      | `Array`              | `[]`    |
| `searchPlaceholder`     | Placeholder text for the search input[Optional].                                     | `string`             | `"Search..."` |
| `config`                | Configuration object for the DataTables plugin[Optional].                             | `Object`             | `{}`    |
| `style`                 | Style object for customizing the table appearance[Optional].                         | `Object`             | `{}`    |
| `onSelect`              | Function to be called when a row is selected[Optional].                               | `Function`           | `() => {}` |

Note: The optional properties are pre-configured with their optimal values by default, reducing the need for manual adjustments. Most users will find the default settings sufficient for their needs.

## Example Data

```jsx
const sampleData = [
  { id: 1, name: 'John Doe', age: 30, city: 'New York' },
  { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
   // Add more data as needed, this is ideally the response JSON array of your api
];

const sampleColumns = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Name' },
  { key: 'age', name: 'Age' },
  { key: 'city', name: 'City' },
]; 
// The key values in the columns array must be of the same name as your data object keys
// The length of the columns array must be equal to the number of unique keys in your data object.
// The name values in the columns array is free-form and can have any value, it will be used to display the column name of the table.
```

## Dependencies

- React
- DataTables
- Bootstrap (optional, for responsive tables)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
### This setup will render a data table with column-wise drop down filters, pagination, searching, sorting, selection and ordering, and a lot more, all customized according to the provided props.
