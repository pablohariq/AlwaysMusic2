const {Pool} = require('pg')

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'alwaysmusic',
    password: 'postgres',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
}
const pool = new Pool(config)

//el manejo de ambos errores (de conexion y de consulta) para todas las operaciones se encuentran en esta función
const realizarConsulta = (consulta) => {
    pool.connect(async (err_conexion, client, release) => {
        if (err_conexion) return console.log(err_conexion)
        try {
            const res = await client.query(consulta)
            console.log(res.rows)
        } catch (error_consulta) {
            console.log("Error de consulta. Código de error: ", error_consulta.code)
        }
        release();
        pool.end()
    })
    }

const agregarNuevoEstudiante = async (args) => {
        const textoConsulta = `INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING *;`
        const objConsulta = { //consultas en formato JSON, lo mejor en seguridad
            name: 'agregar-estudiante',
            rowMode: 'array',
            text: textoConsulta,
            values: args
        } 
        realizarConsulta(objConsulta)
}

const consultarEstudiantes = async () => {
    const textoConsulta = "SELECT * FROM estudiantes;"
    const objConsulta = { 
        name: 'consultar-estudiantes',
        rowMode: 'array',
        text: textoConsulta,
    } 
    realizarConsulta(objConsulta)
}

//se asumirá que la edicion consiste únicamente en:
//declarar primero el nombre del estudiante cuyo registro se editara
//y luego editar TODOS los campos restantes, no algunos de ellos
const editarEstudiante = async (args) => { 
    const textoConsulta = `UPDATE estudiantes SET rut = $2, curso = $3, nivel = $4 WHERE nombre = $1 RETURNING *;`
    const objConsulta = { //consultas en formato JSON, lo mejor en seguridad
        name: 'editar-estudiante',
        rowMode: 'array',
        text: textoConsulta,
        values: args
    } 
    realizarConsulta(objConsulta)
}

const consultarPorRut = async (args) => {
    const textoConsulta = `SELECT * FROM estudiantes WHERE rut = $1`
    const objConsulta = { //consultas en formato JSON, lo mejor en seguridad
        name: 'consultar-rut',
        rowMode: 'array',
        text: textoConsulta,
        values: args
    } 
    realizarConsulta(objConsulta)
}

//solo elimina de a 1 estudiante, el primero que se ingrese en el comando
const eliminarEstudiante = (args) => {
    const textoConsulta = `DELETE FROM estudiantes WHERE rut = $1 RETURNING *;`
    const objConsulta = { //consultas en formato JSON, lo mejor en seguridad
        name: 'eliminar-rut',
        rowMode: 'array',
        text: textoConsulta,
        values: args
    } 
    realizarConsulta(objConsulta)

}

module.exports = {agregarNuevoEstudiante, consultarEstudiantes, editarEstudiante, consultarPorRut, eliminarEstudiante} 