# Kändishälsningar
A web shop that sells personalized video messages from celebrities. This was made for the third assignment in the course Dynamic web development at Medieinstitutet.
## Fulfilled assignment requirements
- Working authentication and authorization
- Only logged in admins can create, update and remove products
- A product page
- Pagination
- Shopping cart
- Users can create a wishlist of products
- Users can reset their password
- Users receive an email confirming their purchase
- Payment service integration
## Dependencies
- bcrypt
- connect-flash
- cookie-parser
- crypto
- dotenv
- ejs
- express
- express-session
- joi
- jsonwebtoken
- mongoose
- multer
- node-sass
- node-sass-middleware
- nodemailer
- nodemon
- stripe
##  Install
Clone the repo and install the dependencies using the following steps:
1. Clone the repo using Git.
```
git clone https://github.com/sophie-akesson/grupp9.git
```
2. Install dependencies using npm.
```
npm i
```
### Set up .env
A few things needs to be in place before you can run the app in localhost:
1. The following information must be filled in an `.env` file in the root directory. Replace `{ info }` with your own information:
```
DB_CONNECTION={ info }
EMAIL_USER="{ info }"
EMAIL_PASSWORD="{ info }"
SECRET_KEY={ info }
STRIPE_SECRET_KEY={ info }
```
## Folder struture
```
├── controller
├── middleware
├── model
├── node_modules
│   └── <package name>
├── public
│   └── images
│   └── style
│   └── uploads
├── routes
├── scss
├── views
```
## Naming conventions
The project uses camelCase for variables, function names and HTML ids and classes. PascalCase is used for Javascript class names.
