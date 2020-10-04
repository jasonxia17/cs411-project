# Struggle Session
Struggle Session is a web app that will allow students to write journal entries about their progress on a course. To view other posts related to a topic, students need to make at least one post about the topic themselves.

This is a class project for CS 411 (Databases). For more information, see the [description on Google Drive](https://docs.google.com/document/d/1DlFQ1HOMPtfcjpWZxPDiQxlC5EViY1SlkK5qC1Ek57I/edit).

## Setting Up
Note: current instructions are for setting up the web app only. The databases haven't been configured yet.
### Install prerequisites
1. Install [npm and Node.js](https://www.npmjs.com/get-npm)
2. Install [Visual Studio Code](https://code.visualstudio.com/) or use your preferred code editor. If you're using vim, please note we will not help you debug. 
3. Install [MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/) and ensure that you can start the MySQL Server and connect using the `mysql` client. 

### Optional tools
1. If you're using VSCode, install the ESLint extension (optional but encouraged).
2. Install Google Chrome, then install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en).
3. Configure your computer so that MySQL server starts on boot, see [instructions for Linux](https://dev.mysql.com/doc/refman/8.0/en/using-systemd.html).

### Set up this project
1. `git clone` this repository and `cd` into the newly created folder.
2. Run `npm install`. This should install all dependencies for the web app.
3. Run `cd mysql && ./initialize.sh <mysql_username>`. Enter your mysql password when prompted. This should set up the database, create tables, and run scripts. If you get a "permission denied" error, you may need to run `chmod +x initialize.sh` to enable execution permission, then try `./initialize.sh <mysql_username>` again.

### Verify setup
Run `npm run dev` and go to https://localhost:3000. You should be able to see a bare-bones website.

## Development
### General
Run `npm run dev`. This will start the development server, which will watch for changes to the web app code and automatically recompile the project. (You might still have to refresh the page in your browser.)

### Pre-commit tasks
Please make sure to run the linter before commiting code (run `npm run lint:fix`). In the future, we should be able to configure the linter to run automatically pre-commit and/or on file save.

### Database changes
If you make changes to the database, you must make it easy for everyone else to make the same changes to their local development database! If you create a schema, make a file inside the `mysql/schemas` folder. If you modify an existing schema, you also need to include a script to move rows from the old table to the new table.

Please run `./initialize.sh` every time you `git pull` to update your database/tables.

## Testing
Coming soon...

## Aside: Project Structure Explanation
This project is built using the framework [Next.js](https://nextjs.org/), which combines React for the frontend and Node.js for the backend. We are also using TypeScript (adds typing to JavaScript).

The <b>frontend</b> code resides in `web-app/components`. You can look at `components/example` for a simple component. The `.tsx` file contains the component declaration and the `.module.css` file contains styles.

The <b>backend</b> code resides in `web-app/pages/api`. Each file path within this folder contains a handler that is mapped to a `/api/*` endpoint. For example, the handler in the file `web-app/pages/api/welcome.ts` will handle requests to the https://localhost:3000/api/welcome endpoint.

The "default" (or "index" page) that you see when you visit `https://localhost:3000` is defined in `web-app/pages/index.tsx`.

The <b>relational database</b> code resides in `mysql`. This is divided into `schemas` for data definition and `scripts` for data manipulation.

## Deployment to staging server
Coming soon...