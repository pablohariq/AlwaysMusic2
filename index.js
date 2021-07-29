// const {Client} = require('pg')
const {consultarEstudiantes, agregarNuevoEstudiante, editarEstudiante, consultarPorRut, eliminarEstudiante} = require('./querymodules')

//recuperar argumentos
const [accion, ...args] = process.argv.slice(2)
// console.log(accion, args)

//ejecucion
const acciones = {
    consulta: consultarEstudiantes,
    nuevo: agregarNuevoEstudiante,
    editar: editarEstudiante,
    rut: consultarPorRut,
    eliminar: eliminarEstudiante
}

if (acciones[accion]){ //si la accion ingresada existe entre las acciones disponibles
    if (args.length == 0){
        acciones[accion]() //para el caso consulta que no lleva argumentos
    }
    else{
        acciones[accion](args) //todos los demás casos reciben argumentos
    }
}
else{
    console.log("El comando ingresado no es válido. Intente nuevamente...")
}
