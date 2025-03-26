import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";
import { count } from "console";
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//admin login
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "10m" }
      );
      return res.json({ loginStatus: true, token: token });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

//category-Get
router.get('/category', verifyToken, (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

//Add Category
router.post('/add_category', verifyToken, (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql, [req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
})

// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})

//Add Employee
router.post('/add_employee', verifyToken, upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file ? req.file.filename : null,
            req.body.category_id
        ]
        con.query(sql, values, (err, result) => {
            if(err){ 
                return res.json({Status: false, Error: err});
            }
            return res.json({Status: true, Message: "Employee Added Successfully"});
        });
    });
});

//employee-Get
router.get('/employee', verifyToken, (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

//search functionality
router.post("/employee/search", verifyToken, (req, res) => {
    const search = req.query.search || "";
    const lowerSearch = search.toLowerCase();
    console.log("searchItem", lowerSearch);

    const query = "SELECT * FROM employee WHERE LOWER(name) LIKE ?";

    con.query(query, [`%${lowerSearch}%`], (err, results) => {
        if (err) {
            return res.status(500).json({status: false, Error: err. message});
        }
        res.json({Status: true, Result: results});
    });
});

//employee list loading
router.post("/employee/loading", verifyToken, (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = 7;
    const Offset= page * limit;

    console.log("searchItem", page);
    const delay = new Promise(resolve => setTimeout(resolve, 3000));

    const query = "SELECT * FROM employee LIMIT ?, ? ";

    con.query(query, [Offset, limit], (err, results) => {
        if (err) {
            return res.status(500).json({status: false, Error: err. message});
        }
        res.json({Status: true, Result: results});
    });
});

//employee details wrt ID
router.get('/employee/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

//update employee details wrt ID
router.put('/edit_employee/:id', upload.single('image'), verifyToken, (req, res) => {
    const id = req.params.id;
    let sql, values;

    if (req.file) {
        // If new image is uploaded
        sql = `UPDATE employee 
            SET name = ?, email = ?, salary = ?, address = ?, category_id = ?, image = ? 
            WHERE id = ?`;
        values = [
            req.body.name,
            req.body.email,
            req.body.salary,
            req.body.address,
            req.body.category_id,
            req.file.filename,
            id
        ];
    } else {
        // If no new image, keep existing image
        sql = `UPDATE employee 
            SET name = ?, email = ?, salary = ?, address = ?, category_id = ?
            WHERE id = ?`;
        values = [
            req.body.name,
            req.body.email,
            req.body.salary,
            req.body.address,
            req.body.category_id,
            id
        ];
    }

    con.query(sql, values, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//delete employee wrt ID
router.delete('/delete_employee/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const sql = "delete from employee where id = ?"
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


//Dashboard(API's)

//no of admins
router.get('/admin_count', verifyToken, (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//no of employees
router.get('/employee_count', verifyToken, (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//total salary
router.get('/salary_count', verifyToken, (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

//admin records -Get
router.get('/admin_records', verifyToken, (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})


//Data Visualisation

// Get salary statistics by category
router.post('/employee/salary-by-category', verifyToken, (req, res) => {
    const sql = "SELECT c.name as category_name,AVG(e.salary) as avg_salary,MAX(e.salary) as max_salary FROM category c LEFT JOIN employee e ON c.id = e.category_id GROUP BY c.id, c.name";
    
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
});



// Get employee count by category
router.post('/employee/employees-by-category', verifyToken, (req, res) => {
    const sql = "SELECT c.name as category_name,COUNT(e.id) as employee_count FROM category c LEFT JOIN employee e ON c.id = e.category_id GROUP BY c.id, c.name";
    
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
});



//admin logout
router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export { router as adminRouter };