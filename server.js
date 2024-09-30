const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, param, validationResult } = require('express-validator');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Student API',
        version: '1.0.0',
        description: 'API documentation for managing students and other resources',
      },
      servers: [
        {
          url: 'http://206.189.203.87:3000',
          description: 'Development server',
        },
      ],
    },
    apis: ['./server.js'],
  };
  
const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(bodyParser.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sample',
  connectionLimit: 10,
  acquireTimeout: 30000,
  connectTimeout: 10000,
});

const executeQuery = async (query, params = []) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query, params);
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
};


/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Retrieve all students
 *     description: Retrieve a list of all students.
 *     responses:
 *       200:
 *         description: A list of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   NAME:
 *                     type: string
 *                     description: Name of the student.
 *                   TITLE:
 *                     type: string
 *                     description: Title of the student.
 *                   CLASS:
 *                     type: string
 *                     description: Class of the student.
 *                   SECTION:
 *                     type: string
 *                     description: Section of the student.
 *                   ROLLID:
 *                     type: number
 *                     description: Roll ID of the student.
 */
app.get('/api/students', async (req, res) => {
  try {
    const results = await executeQuery('SELECT * FROM student');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Retrieve all food items
 *     description: Get a list of all food items.
 *     responses:
 *       200:
 *         description: A list of food items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ITEM_ID:
 *                     type: string
 *                     description: The unique ID of the food item.
 *                     example: F12345
 *                   ITEM_NAME:
 *                     type: string
 *                     description: The name of the food item.
 *                     example: Pizza
 *                   ITEM_UNIT:
 *                     type: string
 *                     description: The unit of measurement for the food item.
 *                     example: pcs
 *                   COMPANY_ID:
 *                     type: string
 *                     description: The ID of the company supplying the food item.
 *                     example: C12345
 *       500:
 *         description: Server error.
 */
app.get('/api/foods', async (req, res) => {
    try {
      const results = await executeQuery('SELECT * FROM foods');
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Retrieve all food items
 *     description: Get a list of all food items.
 *     responses:
 *       200:
 *         description: A list of food items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ITEM_ID:
 *                     type: string
 *                     description: The unique ID of the food item.
 *                     example: F12345
 *                   ITEM_NAME:
 *                     type: string
 *                     description: The name of the food item.
 *                     example: Pizza
 *                   ITEM_UNIT:
 *                     type: string
 *                     description: The unit of measurement for the food item.
 *                     example: pcs
 *                   COMPANY_ID:
 *                     type: string
 *                     description: The ID of the company supplying the food item.
 *                     example: C12345
 *       500:
 *         description: Server error.
 */
app.get('/api/orders', async (req, res) => {
    try {
      const results = await executeQuery('SELECT * FROM orders');
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Add a new student
 *     description: Create a new student record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - NAME
 *               - TITLE
 *               - CLASS
 *               - SECTION
 *               - ROLLID
 *             properties:
 *               NAME:
 *                 type: string
 *                 description: Name of the student.
 *               TITLE:
 *                 type: string
 *                 description: Title of the student.
 *               CLASS:
 *                 type: string
 *                 description: Class of the student.
 *               SECTION:
 *                 type: string
 *                 description: Section of the student.
 *               ROLLID:
 *                 type: number
 *                 description: Roll ID of the student.
 *     responses:
 *       201:
 *         description: Student added successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
app.post(
  '/api/students',
  [
    body('NAME').notEmpty().withMessage('Name is required')
      .isString().isLength({ max: 30 }).withMessage('Name must be a string with a maximum length of 30 characters'),
    body('TITLE').notEmpty().withMessage('Title is required')
      .isString().isLength({ max: 25 }).withMessage('Title must be a string with a maximum length of 25 characters'),
    body('CLASS').notEmpty().withMessage('Class is required')
      .isString().isLength({ max: 5 }).withMessage('Class must be a string with a maximum length of 5 characters'),
    body('SECTION').notEmpty().withMessage('Section is required')
      .isString().isLength({ max: 1 }).withMessage('Section must be a single character'),
    body('ROLLID').notEmpty().withMessage('RollID is required')
      .isDecimal().withMessage('RollID must be a decimal with up to 3 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { NAME, TITLE, CLASS, SECTION, ROLLID } = req.body;
    try {
      const result = await executeQuery(
        'INSERT INTO student (NAME, TITLE, CLASS, SECTION, ROLLID) VALUES (?, ?, ?, ?, ?)',
        [NAME, TITLE, CLASS, SECTION, ROLLID]
      );
      res.status(201).json({ message: 'Student added successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);



/**
 * @swagger
 * /api/students/{class}/{section}/{rollid}:
 *   put:
 *     summary: Update a student
 *     description: Update a student's information by Class, Section, and Roll ID.
 *     parameters:
 *       - name: class
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Class of the student
 *       - name: section
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Section of the student
 *       - name: rollid
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: Roll ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NAME:
 *                 type: string
 *               TITLE:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server error.
 */
app.put(
  '/api/students/:class/:section/:rollid',
  [
    param('class').isString().isLength({ max: 5 }).withMessage('Class must be a string with a maximum length of 5 characters'),
    param('section').isString().isLength({ max: 1 }).withMessage('Section must be a single character'),
    param('rollid').isDecimal().withMessage('RollID must be a decimal with up to 3 digits'),
    body('NAME').notEmpty().withMessage('Name is required')
      .isString().isLength({ max: 30 }).withMessage('Name must be a string with a maximum length of 30 characters'),
    body('TITLE').notEmpty().withMessage('Title is required')
      .isString().isLength({ max: 25 }).withMessage('Title must be a string with a maximum length of 25 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { class: CLASS, section: SECTION, rollid: ROLLID } = req.params;
    const { NAME, TITLE } = req.body;
    try {
      const result = await executeQuery(
        'UPDATE student SET NAME = ?, TITLE = ? WHERE CLASS = ? AND SECTION = ? AND ROLLID = ?',
        [NAME, TITLE, CLASS, SECTION, ROLLID]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({ message: 'Student updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


/**
 * @swagger
 * /api/students/{class}/{section}/{rollid}:
 *   patch:
 *     summary: Partially update a student
 *     description: Partially update a student's information by Class, Section, and Roll ID.
 *     parameters:
 *       - name: class
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           maxLength: 5
 *         description: Class of the student
 *       - name: section
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           maxLength: 1
 *         description: Section of the student
 *       - name: rollid
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *           maximum: 999
 *         description: Roll ID of the student
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NAME:
 *                 type: string
 *                 maxLength: 30
 *                 description: Name of the student
 *               TITLE:
 *                 type: string
 *                 maxLength: 25
 *                 description: Title of the student
 *     responses:
 *       200:
 *         description: Student partially updated successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server error.
 */
app.patch(
  '/api/students/:class/:section/:rollid',
  [
    param('class').isString().isLength({ max: 5 }).withMessage('Class must be a string with a maximum length of 5 characters'),
    param('section').isString().isLength({ max: 1 }).withMessage('Section must be a single character'),
    param('rollid').isDecimal().withMessage('RollID must be a decimal with up to 3 digits'),
    body('NAME').optional().isString().isLength({ max: 30 }).withMessage('Name must be a string with a maximum length of 30 characters'),
    body('TITLE').optional().isString().isLength({ max: 25 }).withMessage('Title must be a string with a maximum length of 25 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { class: CLASS, section: SECTION, rollid: ROLLID } = req.params;
    const { NAME, TITLE } = req.body;

    const updates = {};
    if (NAME) updates.NAME = NAME;
    if (TITLE) updates.TITLE = TITLE;

    const setClause = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), CLASS, SECTION, ROLLID];

    try {
      const result = await executeQuery(`UPDATE student SET ${setClause} WHERE CLASS = ? AND SECTION = ? AND ROLLID = ?`, values);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({ message: 'Student updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


/**
 * @swagger
 * /api/students/{class}/{section}/{rollid}:
 *   delete:
 *     summary: Delete a student
 *     description: Remove a student by Class, Section, and Roll ID.
 *     parameters:
 *       - name: class
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Class of the student
 *       - name: section
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Section of the student
 *       - name: rollid
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *         description: Roll ID of the student
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Server error.
 */
app.delete(
  '/api/students/:class/:section/:rollid',
  [
    param('class').isString().isLength({ max: 5 }).withMessage('Class must be a string with a maximum length of 5 characters'),
    param('section').isString().isLength({ max: 1 }).withMessage('Section must be a single character'),
    param('rollid').isDecimal().withMessage('RollID must be a decimal with up to 3 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { class: CLASS, section: SECTION, rollid: ROLLID } = req.params;
    try {
      const result = await executeQuery('DELETE FROM student WHERE CLASS = ? AND SECTION = ? AND ROLLID = ?', [CLASS, SECTION, ROLLID]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json({ message: 'Student deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

