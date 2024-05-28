# DLQ-Dashboard-Frontend

This React App is a Proof-of-Concept that visualizes AWS SQS Queues and enables a User to perform basic SQS operations like fetching, deleting, and exporting queue messages. To connect with the AWS SQS Service, it uses the [DLQ-Dashboard-Mule-Backend](https://github.com/loveleshkalonia/DLQ-Dashboard-Mule-Backend) Mule API.

In summary, this application features a Navigation Bar, a Home Page, and a Queue Page. Learn more about them below:

## Navigation Bar

Apart from the Title - "DLQ Dashboard" and Current Time (On the right), the Navigation Bar features a "Home" link to go back to the Home Page.

## Home Page

The first page of the DLQ Dashboard features two charts:

### Approx Msg Count - Doughnut Chart

Shows the approximate number of messages from every queue (DLQ). This graph is clickable and is used to navigate to the Queue Page.

### Message Retry Count - Bar Chart

Shows sum total of the retry count attribute (from the first 10 messages) from every queue (DLQ). This graph is not clickable.

## Queue Page

The second page consists of 4 sections:

### Queue Name & Approx Msg Count

Text block showing the name of the queue and the approximate number of messages in it.

### Retriable Message Count - Doughnut Chart

Shows the number of messages (from the first 10 messages) where the retriable attribute is true or false.

### Error Code Count - Doughnut Chart

Shows the number of messages (from the first 10 messages) for every unique value of the error code attribute.

### First 10 Messages - Table & Buttons

The body and attributes of the first 10 messages from the queue are displayed in a table here. There are checkboxes available for every message row to perform bulk operations. The message body can be viewed using the "View" button and copied using the "Copy" button on the small popup. Just below the table, there are 4 buttons - "Delete", "Purge", "Export to Main", and "Refresh Page". The "Delete" and "Export to Main" buttons work in conjunction with the checkboxes. The "Purge" button will delete all messages from the queue, and the "Refresh Page" is to simply reload the page.\
The "Delete", "Purge", and "Export to Main" buttons are tied to a confirmation popup before performing the operation to prevent accidents.

# Code Setup

After cloning the repo, open terminal in the project directory and run:

### `npm install`

This will download and install all dependencies of the project in the ./node_modules folder. After this, you can run the project with the next command.

### `npm start`

Once the dependencies are all downloaded, run this command to start the App in development mode.\
Go to [http://localhost:3000](http://localhost:3000) to view it in your browser.
Press `F12` in the browser to check the console logs.

Make sure that the Mule API is also running so that the functions can make calls and populate various sections of the App or else you will keep seeing infinite loading screens.
___

### Disclaimer:

This code is my first attempt at Frontend development and React. It is very likely that this code is not up to the best coding standards and practices. Also, this code has never seen deployment, you may or may not encounter issues during deployment.\
I am open to receiving feedback/suggestions to polish this code further and learn more.