# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## How to Use the Reusable DataTable Component

The `DataTableComponent` is a reusable React component designed to display data in a table format with additional features such as column-wise dropdown filters and customizable configurations. This component is built using React, jQuery, and Bootstrap, and can be easily integrated into any React project.

### Installation

First, ensure you have Create React App installed. If not, you can install it using:

```bash
npx create-react-app my-app
cd my-app
```

Next, install the necessary dependencies:

```bash
npm install jquery bootstrap datatable.net-bs5
```

### Usage

Import the `DataTableComponent` into your React component or the entry point of your application:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import DataTableComponent from "./path-to-your-component/DataTableComponent";

const App = () => {
  return (
    <div>
      <DataTableComponent
        id="myTable" //Optional prop
        title="Data Table with Column Wise Drop Down Filters" //Optional prop
        subtitle="Reusable data table react component enabled with custom configuration" //Optional prop
        data={[
          { id: 1, name: "John Doe", age: 28, city: "New York" },
          { id: 2, name: "Jane Smith", age: 32, city: "Los Angeles" },
          // Add more data as needed, this is ideally the response JSON array of your api
        ]}
        //Optional props
        searchPlaceholder="Search..."
        config={{
          paging: true,
          searching: true,
          ordering: true,
          lengthChange: false,
          pageLength: 5,
          stateSave: false,
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

### Customization

The `DataTableComponent` accepts several props to customize the table's appearance and behavior:

- **id**: Sets the ID of the table - Optional
- **title**: Sets the title of the table - Optional
- **subtitle**: Sets the subtitle of the table - Optional
- **data**: The array of data to be displayed in the table - Required
- **searchPlaceholder**: Placeholder text for the search input - Optional
- **config**: An object to customize the table's behavior, including paging, searching, ordering, and more - Optional
- **style**: An object to customize the table's style, including class names and width - Optional

Note: The optional properties are pre-configured with their optimal values by default, reducing the need for manual adjustments. Most users will find the default settings sufficient for their needs.

### Example

Here's a more detailed example to illustrate how to use the `DataTableComponent`:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import DataTableComponent from "./path-to-your-component/DataTableComponent";

const App = () => {
  return (
    <div>
      <DataTableComponent
        id="myTable" //Optional prop
        title="Employee Data" //Optional prop
        subtitle="List of all employees" //Optional prop
        data={[
          { id: 1, name: "John Doe", age: 28, city: "New York" },
          { id: 2, name: "Jane Smith", age: 32, city: "Los Angeles" },
          { id: 3, name: "Sam Wilson", age: 25, city: "Chicago" },
          { id: 4, name: "Chris Evans", age: 35, city: "Houston" },
          { id: 5, name: "Chris Evans", age: 35, city: "Houston" },
          { id: 6, name: "Alice Brown", age: 29, city: "Seattle" },
          // Add more data as needed, this is ideally the response JSON array of your api
        ]}
        //Optional props
        searchPlaceholder="Search employees..."
        config={{
          paging: true,
          searching: true,
          ordering: true,
          lengthChange: true,
          pageLength: 5,
          stateSave: true,
        }}
        style={{
          className: "table table-striped table-bordered",
          columnFilterClassName: "form-select form-select-sm",
          width: "100%",
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

This setup will render a data table with column-wise drop down filters, pagination, searching, sorting, and ordering, all customized according to the provided props.
