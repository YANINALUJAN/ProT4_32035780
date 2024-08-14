import {pool} from "./database.js";

class LibrosController{

    async  getAll(req, res) {
        const [result] = await pool.query("SELECT * FROM libros");
        res.json(result);
    }
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

    async add(req, res){
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO libros(nombre, autor, categoria, año-publicacion, ISBN) VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.año-publicacion, libro.ISBN]);
        res.json({"Id insertado": result.insertId});
    }

    async delete(req, res){
    const libro = req.body;
    const [result] = await pool.query("DELETE FROM Libros WHERE id=(?)", [libro.id]);
    res.json({"Registros eliminados": result.affectedRows});
   }

   async update(req, res){
   const libro = req.body;
   const [result]= await pool.query("UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), año-publicacion=(?), ISBN=(?) WHERE id=(?)", [libro.nombre,libro.autor,libro.categoria, libro.año-publicacion, libro.ISBN, libro.id]);
   res.json({"Registros actualizados": result.changedRows});
   }
}
export const libro = new LibrosController();
