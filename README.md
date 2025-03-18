## **Server Setup & Test User Accounts**

### **1. Overview**
This project is a backend server for handling authentication, posts, and comments. Below are sample user accounts for testing purposes.

---

### **2. Sample User Accounts**
#### **Admin User**
- **Email:** `admin@mail.com`
- **Password:** `admin123`

#### **Regular User**
- **Email:** `user@mail.com`
- **Password:** `1234qwer`

---

### **3. How to Use**
1. **Run the Server:**
   ```sh
   npm install   # Install dependencies
   npm start     # Start the server
   ```
2. **Use the test accounts above to log in via Postman or frontend.**
3. **Include the Bearer token in protected routes.**

---

### **4. API Endpoints (User Management)**
| Method | Endpoint                | Description                          | Auth Required |
|--------|-------------------------|--------------------------------------|--------------|
| `POST` | `/users/register`       | Register a new user                 | ❌ No       |
| `POST` | `/users/login`          | Login with email & password         | ❌ No       |
| `GET`  | `/users/profile`        | Get logged-in user profile          | ✅ Yes      |
| `PUT`  | `/users/profile`        | Update user profile                 | ✅ Yes      |
| `GET`  | `/users/search`         | Search for a user by name or email  | ✅ Yes      |
| `GET`  | `/users/all`            | Get all users (Admin only)          | ✅ Yes (Admin) |
| `GET`  | `/users/:id`            | Get a single user by ID             | ✅ Yes      |
| `DELETE` | `/users/:id`         | Delete any user (Admin only)        | ✅ Yes (Admin) |

---

### **5. API Endpoints (Post Management)**
| Method | Endpoint                | Description                          | Auth Required |
|--------|-------------------------|--------------------------------------|--------------|
| `POST` | `/posts/create`         | Create a new post                   | ✅ Yes      |
| `GET`  | `/posts/all`            | Retrieve all posts (Public)         | ❌ No       |
| `GET`  | `/posts/my-posts`       | Retrieve all posts by logged-in user | ✅ Yes      |
| `GET`  | `/posts/:id`            | Retrieve a single post by ID        | ❌ No       |
| `PUT`  | `/posts/update/:id`     | Update a post (Owner/Admin)         | ✅ Yes      |
| `DELETE` | `/posts/delete/:id`   | Delete a post (Owner only)          | ✅ Yes      |
| `DELETE` | `/posts/admin/delete/:id` | Admin can delete any post      | ✅ Yes (Admin) |

---

### **6. API Endpoints (Comment Management)**
| Method | Endpoint                   | Description                                  | Auth Required |
|--------|----------------------------|----------------------------------------------|--------------|
| `POST` | `/comments/create`         | Create a new comment on a post              | ✅ Yes      |
| `GET`  | `/comments/post/:postId`   | Retrieve all comments for a specific post   | ❌ No       |
| `PUT`  | `/comments/update/:id`     | Update a comment (Owner only)               | ✅ Yes      |
| `DELETE` | `/comments/delete/:id`   | Delete a comment (Owner/Admin)              | ✅ Yes      |
| `POST` | `/comments/reply/:commentId` | Reply to a comment                        | ✅ Yes      |

---

### **7. Notes**
- The admin user has full privileges to manage posts and comments.
- The regular user can create, comment, and edit only their own content.
- Ensure to pass the **Bearer Token** in the headers for protected routes.

---

### **8. Contributors**
- **Developer:** Mark Justine A. Lozada 
- **Date:** 2025-03-17  

---

