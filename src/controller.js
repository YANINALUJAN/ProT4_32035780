import {pool} from "./database.js";

class LibrosController{

    /* trae todos los libros */
    async getAll(req, res) {
        const [result] = await pool.query("SELECT * FROM libros");
        res.json(result);
    }  
    /* utilizo el try catch  - trae un libro por Id*/
    async getOne(req, res) {
        const { id } = req.params; // Obtiene el id de los parámetros de la solicitud
        try {
            const [result] = await pool.query("SELECT * FROM libros WHERE id = ?", [id]); // Consulta para obtener un libro por su id
            if (result.length === 0) {
                return res.status(404).json({ message: "Libro no encontrado" }); // Si no se encuentra, devuelve un error 404
            }
            res.json(result[0]); // Devuelve el libro encontrado en formato JSON
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el libro' }); // Manejo de errores
        }
    }

/* Agrega un registro  */
async add(req, res) {
    try {
        const libro = req.body;

        // Validar que solo se envían los campos permitidos
        const validFields = ['nombre', 'autor', 'categoria', 'año_publicacion', 'ISBN'];
        Object.keys(libro).forEach(key => {
            if (!validFields.includes(key)) {
                throw new Error(`El campo ${key} no existe en el modelo de datos.`);
            }
        });

        // Insertar en la base de datos
        const [result] = await pool.query(`
            INSERT INTO libros (nombre, autor, categoria, año_publicacion, ISBN) 
            VALUES (?, ?, ?, ?, ?)`,
            [libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.ISBN]
        );

        // Responder con el ID del libro insertado
        res.json({"Id insertado": result.insertId});

    } catch (error) {
        // Manejo de errores
        console.error("Error al agregar libro:", error.message);
        res.status(400).json({ error: error.message });
    }
}

async delete(req, res) {
    const libro = req.body;

    try {
        // Verificar si el libro existe antes de eliminar
        const [bookExists] = await pool.query("SELECT * FROM Libros WHERE id = ? AND nombre = ?", [libro.id, libro.nombre]);

        if (bookExists.length === 0) {
            return res.status(404).json({ message: "Libro inexistente" });
        }

        // Si el libro existe, proceder a eliminarlo
        const [result] = await pool.query("DELETE FROM Libros WHERE id = ?", [libro.id]);
        
        res.json({ "Registros eliminados": result.affectedRows });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: "Error del servidor al intentar eliminar el libro" });
    }
}


async update(req, res) {
    const libro = req.body;

    try {
        // Verificar que todos los campos requeridos estén presentes
        if (!libro.id || !libro.nombre || !libro.autor || !libro.categoria || !libro.año_publicacion || !libro.ISBN) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si el libro existe antes de intentar actualizar
        const [bookExists] = await pool.query("SELECT * FROM Libros WHERE id = ?", [libro.id]);
        
        if (bookExists.length === 0) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Actualizar el libro
        const [result] = await pool.query(
            "UPDATE Libros SET nombre = ?, autor = ?, categoria = ?, año_publicacion = ?, ISBN = ? WHERE id = ?",
            [libro.nombre, libro.autor, libro.categoria, libro.año_publicacion, libro.ISBN, libro.id]
        );

        // Verificar si se realizaron cambios
        if (result.changedRows === 0) {
            return res.status(304).json({ message: "No se realizaron cambios" });
        }

        res.json({ "Registros actualizados": result.changedRows });

    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: "Error del servidor al intentar actualizar el libro" });
    }
}

}

export const libro = new LibrosController();