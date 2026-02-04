## Prereq
- Node Version: 20+

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
```

# Blog content
 - The content for the blog goes in the `content` folder
 - The assets for the blog like images goes in the public/content_assets folder

# Direct Build And Deploy to GitHub
```
npm run gh-build-deploy
```
# Alternate hacks to deploy anything to buttr.io
## Deploy simple HTML,CSS, JS
Update the index.html in gh-pages branch

## To Deploy a next build:
Copy all content from the /out folder and copy it to buttr.io's gh-pages branch. The index.html is on the gh-pages branch will be picked as the root page

Sample Requests:

sample user_id: 62d613c7-bde4-4e20-88ce-087ed30a0bdf
sample brand_id: 3a1bc58a-4838-4521-a29c-b18e5633220a

Create new User:
POST http://<base_path>/api/users
<!-- In production -->
<!-- http://buttr.io/api/users -->
http://localhost:3000/api/users
{
    "email": "arvey@gmail.com",
    "password": "something@123"
}

Create new Brand
http://localhost:3000/api/brands
{
    "name": "Mast Brands"
}

Create Brand User Permission Map
http://localhost:3000/api/admin/permission
{
    "user_id": "62d613c7-bde4-4e20-88ce-087ed30a0bdf",
    "brand_id": "3a1bc58a-4838-4521-a29c-b18e5633220a",
    "permission": "page:dashboard:view",
    "effect": "allow"
}


