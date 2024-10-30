const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbgmz'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
});

//inventory
//getting the whole table from inventory
app.get('/api/item', (req, res) => {
    const sql = `
        SELECT 
            i.itemId,
            i.itemName,
            i.price,
            i.category,
            i.description,
            COALESCE(SUM(p.quantityProduced), 0) AS totalQuantity  -- Total quantity from tblProduction
        FROM 
            tblItems i
        LEFT JOIN 
            tblProduction p ON i.itemId = p.itemId  -- Join with tblProduction on itemId
        GROUP BY 
            i.itemId;  -- Grouping to get the sum per item
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching inventory items:', err);
            return res.status(500).send('Error fetching inventory items');
        }
        res.json(results);  // Return the results in JSON format
    });
});



//adding item in inventory
app.post('/api/addItem', (req, res) => {
    const { itemName, price,  category , description} = req.body;
    const sql = 'INSERT INTO tblItems (itemName, price, category, description) VALUES (?, ?, ?, ?)';
    db.query(sql, [itemName, price, category, description], (err, result) => {
        if (err) {
            console.error('Error adding inventory item:', err);
            return res.status(500).send('Error adding inventory item');
        }
        res.status(201).send('Inventory item added successfully');
    });
});

//getting specific item in inventory
app.get('/api/updateitem/:id', (req, res) => {
    const sql = 'SELECT * FROM tblItems WHERE itemId = ?';
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching inventory item:', err);
            return res.status(500).send('Error fetching inventory item');
        }
        if (result.length === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(result[0]);
    });
});

//updating item in inventory
app.put('/api/updateitem/:id', (req, res) => {
    const { id } = req.params;
    const { itemName, price, category, description } = req.body;

    const sql = 'UPDATE tblitems SET itemName = ?, price = ?, category = ?, description = ? WHERE itemId = ?';
    db.query(sql, [itemName, price, category, description, id], (err, result) => {
        if (err) {
            console.error('Error updating inventory item:', err);
            return res.status(500).send('Error updating inventory item: ' + err.message);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.send('Item successfully updated');
    });
});

//deleting item in inventory
app.delete('/api/deleteitem/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tblitems WHERE itemId = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting inventory item:', err);
            return res.status(500).send('Error deleting inventory item');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.send('Item deleted successfully');
    });
});

// Get inventory details from tblInventory by itemId
app.get('/api/inventory/:itemId', (req, res) => {
    const itemId = req.params.itemId; // Corrected from req.params.id to req.params.itemId
    const sql = 'SELECT * FROM tblInventory WHERE itemId = ?';

    db.query(sql, [itemId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'No inventory found for this item' });
        }
        res.json(result);
    });
});

//get info
app.get('/api/inventory-by-item/:itemId', (req, res) => {
    const { itemId } = req.params;
    
    const sqlQuery = `
        SELECT 
            inv.inventoryId,
            inv.productionId,
            inv.quantity,
            inv.status,
            inv.lastUpdated,
            p.itemId,
            p.quantityProduced,
            p.productionDate,
            p.staffName,
            i.itemName,
            i.price,
            i.category,
            i.description
        FROM 
            tblinventory inv 
        JOIN 
            tblproduction p ON inv.productionId = p.productionId
        JOIN 
            tblitems i ON p.itemId = i.itemId
        WHERE 
            p.itemId = ?;
    `;
    
    db.query(sqlQuery, [itemId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

// Route to fetch combined raw materials data
app.get('/api/rawmats-data', (req, res) => {
    const query = `
        SELECT 
            r.matId AS rawMatId,
            r.matName AS itemName,
            i.quantity,
            d.cost,
            d.date,
            i.status,
            i.lastUpdated,
            (SELECT s.supplyName FROM tblsuppliers s WHERE d.supplyId = s.supplyId) AS supplierName
        FROM 
            tblrawmatsinv i
        JOIN 
            tblsupdeli d ON d.supDeliId = i.supDeliId  -- Join tblrawmatsinv with tblsupdeli using supDeliId
        JOIN 
            tblrawmats r ON r.matId = d.matId  -- Join tblsupdeli with tblrawmats using matId
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching raw materials data:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

  




//raw materials
//getting materials
app.get('/api/rawmats', async (req, res) => {
    try {
        const query = 'SELECT * FROM tblRawMats'; // Adjust table name and fields as needed
        db.query(query, (error, results) => {
            if (error) {
                console.error("Error fetching raw materials: ", error);
                res.status(500).send("Server Error");
            } else {
                res.json(results);
            }
        });
    } catch (error) {
        console.error("Error in fetching raw materials: ", error);
        res.status(500).send("Server Error");
    }
});

// Adding item to inventory
app.post('/api/addmats', (req, res) => {
    const { matName, category } = req.body; // Use matName to match the frontend
    const sql = 'INSERT INTO tblRawMats (matName, quantity, category) VALUES (?, 0, ?)';
    db.query(sql, [matName, category], (err, result) => {
        if (err) {
            console.error('Error adding inventory item:', err);
            return res.status(500).send('Error adding inventory item');
        }
        res.status(201).send('Inventory item added successfully');
    });
});


// Fetch item by ID
app.get('/api/updatemats/:matId', (req, res) => {
    const { matId } = req.params;
    const sql = 'SELECT * FROM tblRawMats WHERE matId = ?'; // Correct table name and field

    db.query(sql, [matId], (err, result) => {
        if (err) {
            console.error('Error fetching inventory item:', err);
            return res.status(500).send('Error fetching inventory item');
        }
        if (result.length === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(result[0]);
    });
});


// Update item by ID
app.put('/api/updatemats/:matId', (req, res) => {
    const { matId } = req.params;
    const { matName, quantity, category } = req.body;

    const sql = 'UPDATE tblRawMats SET matName = ?, quantity = ?, category = ? WHERE matId = ?';

    db.query(sql, [matName, quantity, category, matId], (err, result) => {
        if (err) {
            console.error('Error updating raw material:', err);
            return res.status(500).json({ error: 'Database error occurred' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Material not found' });
        }
    });
});





//deleting item in inventory
app.delete('/api/deletemats/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tblRawMats WHERE matId = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting inventory item:', err);
            return res.status(500).send('Error deleting inventory item');
        }
        console.log('Delete result:', result); // Log the result of the deletion
        if (result.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.send('Item deleted successfully');
    });
});

app.get('/api/rawmats-inventory', (req, res) => {
    const sqlQuery = `
        SELECT 
            inv.inventoryId,
            inv.matId,
            inv.quantity,
            inv.status,
            inv.lastUpdated
        FROM 
            tblrawmatsinv inv;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

//getting the details for raw mats details in system admin
app.get('/api/rawmats-data/:matId', (req, res) => {
    const { matId } = req.params;  // Get the matId from the request parameters

    const query = `
        SELECT 
            r.matId AS rawMatId,
            r.matName AS itemName,
            i.quantity,
            d.cost,
            d.date,
            i.status,
            i.lastUpdated,
            (SELECT s.supplyName FROM tblsuppliers s WHERE d.supplyId = s.supplyId) AS supplierName
        FROM 
            tblrawmatsinv i
        JOIN 
            tblsupdeli d ON d.supDeliId = i.supDeliId  -- Join tblrawmatsinv with tblsupdeli using supDeliId
        JOIN 
            tblrawmats r ON r.matId = d.matId  -- Join tblsupdeli with tblrawmats using matId
        WHERE 
            r.matId = ?  -- Filter by the specific matId
    `;

    db.query(query, [matId], (err, results) => {  // Pass matId as a parameter
        if (err) {
            console.error('Error fetching raw materials data:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});







//supplier
// Fetch all suppliers
app.get('/api/supplier', async (req, res) => {
    try {
        const query = `
            SELECT s.supplyId, s.supplyName, s.address, s.contact, 
            GROUP_CONCAT(r.matName) AS products
            FROM tblsuppliers s
            LEFT JOIN tblsupplierrawmats sr ON s.supplyId = sr.supplierId
            LEFT JOIN tblrawmats r ON sr.rawMatId = r.matId
            GROUP BY s.supplyId;
        `;
        db.query(query, (error, results) => {
            if (error) {
                console.error("Error fetching supplier data: ", error);
                res.status(500).send("Server Error");
            } else {
                res.json(results);
            }
        });
    } catch (error) {
        console.error("Error in fetching suppliers: ", error);
        res.status(500).send("Server Error");
    }
});

//getting the details for Supplier details modal in system adminF
app.get('/api/supplier/:id', async (req, res) => {
    const supplyId = req.params.id; // Get the supplyId from the request parameters

    try {
        const [results] = await db.query(`
            SELECT s.supplyId, s.supplyName, s.address, s.contact, 
                   GROUP_CONCAT(r.matName) AS products
            FROM tblsuppliers s
            LEFT JOIN tblsupplierrawmats sr ON s.supplyId = sr.supplierId
            LEFT JOIN tblrawmats r ON sr.rawMatId = r.matId
            WHERE s.supplyId = ?
            GROUP BY s.supplyId
        `, [supplyId]); // Pass the supplyId as a parameter

        res.json(results);
    } catch (error) {
        console.error('Error fetching supplier details:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Add a supplier
app.post('/api/addsupplier', async (req, res) => {
    const { supplyName, address, contact, product } = req.body;

    try {
        // Insert supplier first
        const supplierQuery = `INSERT INTO tblsuppliers (supplyName, address, contact) VALUES (?, ?, ?)`;
        const supplierValues = [supplyName, address, contact];
        db.query(supplierQuery, supplierValues, (error, results) => {
            if (error) {
                console.error("Error adding supplier: ", error);
                return res.status(500).send("Server Error");
            }

            const newSupplierId = results.insertId; // Get the inserted supplier's ID

            // Now insert the raw materials into tblsupplierrawmats
            if (product && product.length > 0) {
                const supplierRawMatsQuery = `
                    INSERT INTO tblsupplierrawmats (supplierId, rawMatId) 
                    VALUES ${product.map(() => "(?, ?)").join(", ")}
                `;
                const supplierRawMatsValues = product.flatMap(p => [newSupplierId, p]);
                
                db.query(supplierRawMatsQuery, supplierRawMatsValues, (err) => {
                    if (err) {
                        console.error("Error adding raw materials: ", err);
                        return res.status(500).send("Server Error");
                    }
                    res.send("Supplier and raw materials added successfully");
                });
            } else {
                res.send("Supplier added without raw materials");
            }
        });
    } catch (error) {
        console.error("Error in adding supplier: ", error);
        res.status(500).send("Server Error");
    }
});


// Route to get raw materials for a specific supplier
app.get('/api/supplier/:supplierId/rawmats', (req, res) => {
    const supplierId = req.params.supplierId;

    const query = `
        SELECT rm.matId, rm.matName 
        FROM tblsupplierrawmats sr
        JOIN tblrawmats rm ON sr.rawMatId = rm.matId
        WHERE sr.supplierId = ?
    `;

    db.query(query, [supplierId], (err, results) => {
        if (err) {
            console.error('Error fetching supplier raw materials:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});




// Update a supplier
app.put('/api/supplier/:id', async (req, res) => {
    const { supplyName, address, contact, product } = req.body; // Expect product as an array

    if (!supplyName || !address || !contact) {
        return res.status(400).send('All fields are required'); // Basic validation
    }

    const supplierId = req.params.id;

    try {
        // Update supplier details
        const supplierQuery = `
            UPDATE tblsuppliers 
            SET supplyName = ?, address = ?, contact = ? 
            WHERE supplyId = ?
        `;
        const supplierValues = [supplyName, address, contact, supplierId];

        db.query(supplierQuery, supplierValues, (error, results) => {
            if (error) {
                console.error('Error updating supplier: ', error);
                return res.status(500).send('Server Error');
            }

            if (results.affectedRows === 0) {
                return res.status(404).send('Supplier not found'); // Handle case where no rows are affected
            }

            // Now handle the raw materials related to the supplier
            // First, remove existing raw materials for this supplier
            const deleteQuery = `DELETE FROM tblsupplierrawmats WHERE supplierId = ?`;
            db.query(deleteQuery, [supplierId], (err) => {
                if (err) {
                    console.error("Error deleting existing raw materials: ", err);
                    return res.status(500).send("Server Error");
                }

                // Insert new raw materials
                if (product && product.length > 0) {
                    const supplierRawMatsQuery = `
                        INSERT INTO tblsupplierrawmats (supplierId, rawMatId) 
                        VALUES ${product.map(() => "(?, ?)").join(", ")}
                    `;
                    const supplierRawMatsValues = product.flatMap(p => [supplierId, p]);

                    db.query(supplierRawMatsQuery, supplierRawMatsValues, (err) => {
                        if (err) {
                            console.error("Error adding raw materials: ", err);
                            return res.status(500).send("Server Error");
                        }
                        res.send("Supplier and raw materials updated successfully");
                    });
                } else {
                    res.send("Supplier updated without raw materials");
                }
            });
        });
    } catch (error) {
        console.error("Error in updating supplier: ", error);
        res.status(500).send("Server Error");
    }
});


// Fetch supplier including product array
app.get('/api/supplier/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM tblsuppliers WHERE supplyId = ?';
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error fetching supplier:', err);
                return res.status(500).send('Error fetching supplier');
            }
            if (results.length > 0) {
                const supplier = results[0];
                supplier.product = JSON.parse(supplier.product); // Convert JSON string back to array
                res.json(supplier);
            } else {
                res.status(404).send('Supplier not found');
            }
        });
    } catch (error) {
        console.error('Error in fetching supplier:', error);
        res.status(500).send('Error fetching supplier');
    }
});


// Update a supplier
app.put('/api/supplier/:supplyId', (req, res) => { // Use 'supplyId' here
    const { supplyId } = req.params; // Use 'supplyId' here
    const { supplyName, contact, address, product } = req.body;
    const sql = 'UPDATE tblsuppliers SET supplyName = ?, contact = ?, address = ?, product = ? WHERE supplyId = ?';

    db.query(sql, [supplyName, contact, address, product, supplyId], (err, result) => {
        if (err) {
            console.error('Error updating supplier:', err);
            return res.status(500).send('Error updating supplier');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Supplier not found');
        }
        res.send('Supplier updated successfully');
    });
});



// Delete a supplier and its associated raw materials
app.delete('/api/deletesupplier/:id', (req, res) => {
    const supplierId = req.params.id;

    // First, delete the raw materials associated with the supplier
    const deleteRawMaterialsQuery = 'DELETE FROM tblsupplierrawmats WHERE supplierId = ?';
    db.query(deleteRawMaterialsQuery, [supplierId], (err) => {
        if (err) {
            console.error('Error deleting raw materials:', err);
            return res.status(500).send('Error deleting raw materials');
        }

        // Now delete the supplier
        const sql = 'DELETE FROM tblsuppliers WHERE supplyId = ?';
        db.query(sql, [supplierId], (err, result) => {
            if (err) {
                console.error('Error deleting supplier:', err);
                return res.status(500).send('Error deleting supplier');
            }

            // Check if any rows were affected (supplier exists)
            if (result.affectedRows === 0) {
                return res.status(404).send('Supplier not found');
            }

            res.json({ message: 'Supplier and associated raw materials deleted' });
        });
    });
});







//supply delivery
// Fetch all Supply delivery
app.get('/api/supDeli', async (req, res) => {
    try {
        const query = `
            SELECT sd.supDeliId, sd.supplyId, rm.matName, sd.quantity, sd.cost, sd.date 
            FROM tblSupDeli sd 
            JOIN tblrawmats rm ON sd.matId = rm.matId`; // Adjust table names and fields as needed
        db.query(query, (error, results) => {
            if (error) {
                console.error("Error fetching supply deliveries: ", error);
                res.status(500).send("Server Error");
            } else {
                res.json(results);
            }
        });
    } catch (error) {
        console.error("Error in fetching supply deliveries: ", error);
        res.status(500).send("Server Error");
    }
});

//getting the details for Supplier Details Modal for system admin
app.get('/api/supDeli/:id', async (req, res) => {
    const supplyId = req.params.id; // Get the supplyId from the request parameters

    try {
        const query = `
            SELECT sd.supDeliId, sd.supplyId, rm.matName, sd.quantity, sd.cost, sd.date 
            FROM tblSupDeli sd 
            JOIN tblrawmats rm ON sd.matId = rm.matId
            WHERE sd.supplyId = ?`; // Add the WHERE clause to filter by supplyId

        // Pass the supplyId as a parameter to the query
        db.query(query, [supplyId], (error, results) => {
            if (error) {
                console.error("Error fetching supply deliveries: ", error);
                res.status(500).send("Server Error");
            } else {
                res.json(results);
            }
        });
    } catch (error) {
        console.error("Error in fetching supply deliveries: ", error);
        res.status(500).send("Server Error");
    }
});



// getting products of the suppliers
app.get('/api/supplier/:supplyId/products', (req, res) => {
    const supplyId = req.params.supplyId;
    
    const query = 'SELECT product FROM tblsuppliers WHERE supplyId = ?';
    db.query(query, [supplyId], (error, results) => {
        if (error) {
            console.error("Error fetching supplier products: ", error);
            res.status(500).send("Server Error");
        } else if (results.length > 0) {
            try {
                // Parse the JSON product array
                const products = JSON.parse(results[0].product);
                res.json(products);
            } catch (parseError) {
                console.error("Error parsing product JSON: ", parseError);
                res.status(500).send("Server Error");
            }
        } else {
            res.json([]); // Return empty array if no products are found
        }
    });
});

// Get products for a specific supplier
app.get('/api/suppliers/:supplyId/products', async (req, res) => {
    const supplyId = req.params.supplyId;
    try {
        const query = 'SELECT product FROM tblsuppliers WHERE supplyId = ?';
        db.query(query, [supplyId], (error, results) => {
            if (error) {
                console.error("Error fetching products: ", error);
                res.status(500).send("Server Error");
            } else if (results.length === 0) {
                res.status(404).send("Supplier not found");
            } else {
                // Assuming products are stored as a JSON string in the product field
                const products = JSON.parse(results[0].product);
                res.json(products);
            }
        });
    } catch (error) {
        console.error("Error in fetching products: ", error);
        res.status(500).send("Server Error");
    }
});

// Fetch all suppliers
app.get('/api/suppliers', async (req, res) => {
    try {
        const query = 'SELECT * FROM tblsuppliers';
        db.query(query, (error, results) => {
            if (error) {
                console.error("Error fetching suppliers: ", error);
                res.status(500).send("Server Error");
            } else {
                // Parse the product field as JSON and handle invalid JSON or null values
                const suppliers = results.map(supplier => ({
                    ...supplier,
                    product: supplier.product ? JSON.parse(supplier.product) : [] // Use an empty array if product is null
                }));
                res.json(suppliers);
            }
        });
    } catch (error) {
        console.error("Error in fetching suppliers: ", error);
        res.status(500).send("Server Error");
    }
});

// Express.js route to get raw materials for a specific supplier
app.get('/api/getrawmaterials/:supplierId', (req, res) => {
    const supplierId = req.params.supplierId;

    // Query to fetch raw material names based on the supplierId
    const query = `
        SELECT r.matName , r.matId
        FROM tblsupplierrawmats s
        JOIN tblrawmats r ON s.rawMatId = r.matId
        WHERE s.supplierId = ?`;

    db.query(query, [supplierId], (error, results) => {
        if (error) {
            console.error('Error fetching raw materials:', error);
            return res.status(500).send('Error fetching raw materials');
        }
        
        res.json(results); // Send back the list of raw material names
    });
});




// Add supply delivery
app.post('/api/addsupplydelivery', (req, res) => {
    const { supplyId, matId, quantity, cost, date } = req.body; // Changed itemName to matId

    console.log("Received delivery data:", req.body);

    // Check if any required fields are missing
    if (!supplyId || !matId || !quantity || !cost || !date) { // Adjusted here
        console.error("Missing fields in the request body");
        return res.status(400).send("Bad Request: Missing required fields");
    }

    const query = `
        INSERT INTO tblSupDeli (supplyId, matId, quantity, cost, date) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [supplyId, matId, quantity, cost, date]; // Adjusted here

    db.query(query, values, (error, results) => {
        if (error) {
            console.error("Error executing SQL query:", error);
            return res.status(500).send("Server Error");
        } else {
            console.log("Supply delivery added successfully:", results);
            res.status(200).send("Supply delivery added successfully.");
        }
    });
});






//edit supply delivery
// Fetch a single supply delivery by ID
app.get('/api/supplydelivery/:deliveryId', (req, res) => {
    const { deliveryId } = req.params;
    const query = 'SELECT * FROM tblSupDeli WHERE supdeliId = ?'; // Adjust to your table and column names
    db.query(query, [deliveryId], (error, results) => {
        if (error) {
            console.error('Error fetching supply delivery:', error);
            res.status(500).send("Server Error");
        } else if (results.length === 0) {
            res.status(404).send("Supply delivery not found");
        } else {
            res.json(results[0]);
        }
    });
});

// Update a supply delivery
app.put('/api/updatesupplydelivery/:deliveryId', (req, res) => {
    const { deliveryId } = req.params;
    const { supplyId, itemName, quantity, cost, date } = req.body;

    const query = `
        UPDATE tblSupDeli 
        SET supplyId = ?, itemName = ?, quantity = ?, cost = ?, date = ?
        WHERE supDeliId = ?
    `;
    const values = [supplyId, itemName, quantity, cost, date, deliveryId];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Error updating supply delivery:', error);
            res.status(500).send("Server Error");
        } else {
            res.status(200).send("Supply delivery updated successfully.");
        }
    });
});



// API Route: Get Categories
app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM tblCategories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// API Route: Get Inventory Categories
app.get('/api/categories/inventory', (req, res) => {
    const query = "SELECT * FROM tblCategories WHERE type = 'Inventory'";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching inventory categories:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// API Route: Get RawMaterials Categories
app.get('/api/categories/rawMaterials', (req, res) => {
    const query = "SELECT * FROM tblCategories WHERE type = 'RawMaterial'";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching inventory categories:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});


// GET: Fetch all production records
app.get('/api/production', (req, res) => {
    const query = 'SELECT * FROM tblproduction';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// GET: Fetch a single production record by productionId
app.get('/api/production/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM tblproduction WHERE productionId = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// POST: Add a new production record
app.post('/api/addProduction', async (req, res) => {
    const { itemId, quantityProduced, staffName } = req.body;
    const productionDate = new Date(); // Automatically set to today's date

    try {
        const sql = 'INSERT INTO tblProduction (itemId, quantityProduced, staffName, productionDate) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [itemId, quantityProduced, staffName, productionDate]);
        res.status(200).send('Production record added successfully');
    } catch (error) {
        console.error('Error adding production:', error);
        res.status(500).send('Error adding production');
    }
});


// PUT: Update a production record by productionId
app.post('/api/addProduction', (req, res) => {
    const { itemId, quantityProduced, productionDate, staffName } = req.body;

    // Insert into tblProduction
    const productionQuery = `
        INSERT INTO tblproduction (itemId, quantityProduced, productionDate, staffName)
        VALUES (?, ?, ?, ?)
    `;
    db.query(productionQuery, [itemId, quantityProduced, productionDate, staffName], (err, result) => {
        if (err) return res.status(500).send(err);

        const productionId = result.insertId;  // Get the inserted productionId

        // Insert into tblInventory based on the production record
        const inventoryQuery = `
            INSERT INTO tblInventory (productionId, status)
            VALUES (?, Available)
        `;
        db.query(inventoryQuery, [productionId, status], (err, inventoryResult) => {
            if (err) return res.status(500).send(err);

            res.json({ message: 'Production and inventory records added successfully!' });
        });
    });
});

// DELETE: Delete a production record by productionId
app.delete('/api/production/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tblproduction WHERE productionId = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Production record not found' });
        }
        res.json({ message: 'Production record deleted successfully!' });
    });
});


// Combined Data API Endpoint for 
app.get('/api/combined-data', (req, res) => {
    const sqlQuery = `
        SELECT 
            p.productionId,
            i.itemName,
            inv. quantity,
            p.productionDate AS date,
            p.staffName AS staff,
            inv.status,
            inv.lastUpdated
        FROM 
            tblproduction p
        JOIN 
            tblinventory inv ON p.productionId = inv.productionId
        JOIN 
            tblitems i ON p.itemId = i.itemId;
    `;

    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

app.get('/api/combined-data/:itemId', (req, res) => {
    const { itemId } = req.params;
    const sqlQuery = `
        SELECT 
            p.productionId,
            i.itemName,
            inv.quantity,
            p.productionDate AS date,
            p.staffName AS staff,
            inv.status,
            inv.lastUpdated
        FROM 
            tblproduction p
        JOIN 
            tblinventory inv ON p.productionId = inv.productionId
        JOIN 
            tblitems i ON p.itemId = i.itemId
        WHERE 
            i.itemId = ?;
    `;

    db.query(sqlQuery, [itemId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});



//sales admin
//order
// Fetch all orders
app.get('/api/orders', (req, res) => {
    const query = `
        SELECT 
            o.orderId, 
            o.quantity, 
            o.customerName, 
            o.date, 
            o.location, 
            o.modeOfPayment, 
            o.paymentStatus, 
            o.status, 
            o.price,
            i.itemName
        FROM 
            tblorders o
        JOIN 
            tblItems i ON o.itemId = i.itemId
    `;

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// Fetch items for the dropdown
app.get('/api/items', (req, res) => {
    const query = 'SELECT itemId, itemName FROM tblItems'; // Adjust the table name as needed
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching items' });
        }
        res.json(results);
    });
});

// Route to add a new order
app.post('/api/orders', (req, res) => {
    const { itemId, customerName, date, location, modeOfPayment, paymentStatus, price } = req.body;

    // SQL query to insert a new order
    const query = 'INSERT INTO tblorders (itemId, customerName, date, location, modeOfPayment, status, paymentStatus, price) VALUES (?, ?, ?, ?, ?, "preparing", ?, ?)';
    db.query(query, [itemId, customerName, date, location, modeOfPayment, paymentStatus, price], (error, results) => {
        if (error) {
            console.error('Error adding order:', error);
            return res.status(500).json({ error: 'An error occurred while adding the order.' });
        }
        res.status(201).json({ message: 'Order added successfully', orderId: results.insertId });
    });
});










app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});