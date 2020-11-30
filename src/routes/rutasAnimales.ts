import {Request, Response, Router } from 'express'
import { Animales, Animal, tAnimal } from '../model/Animal'
import { db } from '../database/database'

class rutasAnimales {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

//Listamos todos los animales que tenemos en la base de datos

    private getAnimales = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query = await Animales.find({})
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })
         db.desconectarBD()
     }
  
//Introducimos los datos de un animal a traves de un post.

    private animalnuevoPost = async (req: Request, res: Response) => {
        console.log(req.body) 
        const { nombre,especie, peso, altura, curado, operaciones } = req.body //le pasamos los datos con el body
        console.log(nombre)
        const dSchema = {
            _nombre: nombre,
            _especie: especie,
            _peso: parseInt(peso),
            _altura: parseInt(altura),
            _curado: curado,
            _operaciones: parseInt(operaciones)
        }
        console.log(dSchema)
        const oSchema = new Animales(dSchema)
        await db.conectarBD() //Conectamos a la base de datos 
        await oSchema.save() // Guardamos los datos introducidos
        .then( (doc) => {
            console.log('Tenemos un nuevo animal: '+ doc) 
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Algo salió mal: '+ err)
            res.send('Algo salió mal: '+ err)
        }) 
        await db.desconectarBD()
    }     

/*
    private animalnuevoget = async (req: Request, res: Response) => {
        const { nombre, especie, peso, altura, curado, operaciones } = req.params
        console.log(req.params)

        await db.conectarBD()
        const dSchema = {
            _nombre: nombre,
            _especie: especie,
            _peso: parseInt(peso),
            _altura: parseInt(altura),
            _curado: curado,
            _operaciones: parseInt(operaciones)
        }
        const oSchema = new Animales(dSchema)
        await oSchema.save()
        .then( (doc) => {
            console.log('Salvado Correctamente: '+ doc)
            res.json(doc)
        })
        .catch( (err: any) => {
            console.log('Error: '+ err)
            res.send('Error: '+ err)
        }) 
        await db.desconectarBD()
    }  
*/

//Medidas de la jaula necesaria para el animal que le pasemos como parámetro

    private jaula = async (req: Request, res: Response) => {
        const { nombre } = req.params //Pasamos parametro
        await db.conectarBD()
        .then( async () => {
            const query: any = await Animales.findOne({_nombre: nombre}) 
            //Busca en la BD y nos devuelve un documento el cual guardamos en una query 
            if (query == null){
                console.log('Error, animal no encontrado')
                res.json({})
            }else{
                const f: any = new Animal(query._nombre, query._especie, 
                    query._peso, query._altura, query._curado,
                    query._operaciones)
                res.json({"Nombre del animal": f._nombre, "Necesitaremos una jaula de ": f.jaula()})
            }
        })
        db.desconectarBD()
    }

//Calculo de la comida semanal necesaria por animal a través de su nombre.
    private comida = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        .then( async () => {
            const query: any = await Animales.findOne({_nombre: nombre})
            if (query == null){
                console.log('Error, animal no encontrado')
                res.json({})
            }else{
                const f: any = new Animal(query._nombre, query._especie, 
                    query._peso, query._altura, query._curado,
                    query._operaciones)
                res.json({"Nombre del animal": f._nombre, "Necesitaremos un total de comida de ": f.comida()})
            }
        })
        db.desconectarBD()
    }

//Calculos de capital necesario para el mantenimiento del animal.

    private total = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        .then( async () => {
            const query: any = await Animales.findOne({_nombre: nombre})
            if (query == null){
                console.log('Error, animal no encontrado')
                res.json({})
            }else{
                const f: any = new Animal(query._nombre, query._especie, 
                    query._peso, query._altura, query._curado,
                    query._operaciones)
                res.json({"Nombre del animal": f._nombre, "Necesitaremos un total en comida de ": f.precioComida(),
                          "Gastaremos en operaciones ": f.precioOperacion(), "En total necesitaríamos ": f.total()
            })
            }
        })
        db.desconectarBD()
    }

//Borrar a un animal de la base de datos.
    private liberarAnimal = async (req: Request, res: Response) => {
        const {nombre } = req.params
        await db.conectarBD()
        await Animales.findOneAndDelete( //Encontrar y borrar un documento de la BD
            { _nombre: nombre }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        console.log(`Ese animal no existe o ha sido libreado`)
                        res.send(`Ese animal no existe o ha sido libreado`)
                    }else {
                        console.log('Animal liberado con éxito: '+ doc)
                        res.send('Animal liberado con éxito: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }

//Cambiar los datos de un animal indicando el nombre del animal a actualizar
    private actualiza = async (req: Request, res: Response) => {
        const { nombre } = req.params
        const { especie, peso, altura, curado, operaciones } = req.body
        await db.conectarBD()
        await Animales.findOneAndUpdate(
                { _nombre: nombre }, 
                {
                     _nombre: nombre,
                    _especie: especie,
                    _peso: peso,
                    _altura: altura,
                    _curado: curado,
                    _operaciones: operaciones
                },
                {
                    new: true,
                    runValidators: true
                }  
            )
            .then( (doc) => {
                    if (doc==null){
                        console.log('El animal no existe o ha sido liberado')
                        res.json({"Error":"No existe: "+nombre})
                    } else {
                        console.log('Animal actualizado: '+ doc) 
                        res.json(doc)
                    }
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            )
        db.desconectarBD()
    }

//RUTAS 

    misRutas(){
        this._router.get('/', this.getAnimales)
        this._router.post('/nuevo', this.animalnuevoPost)
     // this._router.get('/nuevoget/:nombre&:especie&:peso&:altura&:curado&:operaciones', this.animalnuevoget)
        this._router.get('/jaula/:nombre', this.jaula)
        this._router.get('/comida/:nombre', this.comida)
        this._router.get('/total/:nombre', this.total)
        this._router.get('/liberar/:nombre', this.liberarAnimal)
        this._router.post('/actualizar/:nombre', this.actualiza)
    }
}

const obj = new rutasAnimales()
obj.misRutas()
export const RutasAnimales = obj.router
