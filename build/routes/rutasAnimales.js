"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RutasAnimales = void 0;
const express_1 = require("express");
const Animal_1 = require("../model/Animal");
const database_1 = require("../database/database");
class rutasAnimales {
    constructor() {
        //Listamos todos los animales que tenemos en la base de datos
        this.getAnimales = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield Animal_1.Animales.find({});
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            database_1.db.desconectarBD();
        });
        //Introducimos los datos de un animal a traves de un post.
        this.animalnuevoPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { nombre, especie, peso, altura, curado, operaciones } = req.body; //le pasamos los datos con el body
            console.log(nombre);
            const dSchema = {
                _nombre: nombre,
                _especie: especie,
                _peso: parseInt(peso),
                _altura: parseInt(altura),
                _curado: curado,
                _operaciones: parseInt(operaciones)
            };
            console.log(dSchema);
            const oSchema = new Animal_1.Animales(dSchema);
            yield database_1.db.conectarBD(); //Conectamos a la base de datos 
            yield oSchema.save() // Guardamos los datos introducidos
                .then((doc) => {
                console.log('Tenemos un nuevo animal: ' + doc);
                res.json(doc);
            })
                .catch((err) => {
                console.log('Algo salió mal: ' + err);
                res.send('Algo salió mal: ' + err);
            });
            yield database_1.db.desconectarBD();
        });
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
        this.jaula = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params; //Pasamos parametro
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Animal_1.Animales.findOne({ _nombre: nombre });
                //Busca en la BD y nos devuelve un documento el cual guardamos en una query 
                if (query == null) {
                    console.log('Error, animal no encontrado');
                    res.json({});
                }
                else {
                    const f = new Animal_1.Animal(query._nombre, query._especie, query._peso, query._altura, query._curado, query._operaciones);
                    res.json({ "Nombre del animal": f._nombre, "Necesitaremos una jaula de ": f.jaula() });
                }
            }));
            database_1.db.desconectarBD();
        });
        //Calculo de la comida semanal necesaria por animal a través de su nombre.
        this.comida = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Animal_1.Animales.findOne({ _nombre: nombre });
                if (query == null) {
                    console.log('Error, animal no encontrado');
                    res.json({});
                }
                else {
                    const f = new Animal_1.Animal(query._nombre, query._especie, query._peso, query._altura, query._curado, query._operaciones);
                    res.json({ "Nombre del animal": f._nombre, "Necesitaremos un total de comida de ": f.comida() });
                }
            }));
            database_1.db.desconectarBD();
        });
        //Calculos de capital necesario para el mantenimiento del animal.
        this.total = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Animal_1.Animales.findOne({ _nombre: nombre });
                if (query == null) {
                    console.log('Error, animal no encontrado');
                    res.json({});
                }
                else {
                    const f = new Animal_1.Animal(query._nombre, query._especie, query._peso, query._altura, query._curado, query._operaciones);
                    res.json({ "Nombre": f._nombre, "total_comida ": f.precioComida(),
                        "total_operaciones ": f.precioOperacion(), "total ": f.total()
                    });
                }
            }));
            database_1.db.desconectarBD();
        });
        //Borrar a un animal de la base de datos.
        this.liberarAnimal = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD();
            yield Animal_1.Animales.findOneAndDelete(//Encontrar y borrar un documento de la BD
            { _nombre: nombre }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        console.log(`Ese animal no existe o ha sido libreado`);
                        res.send(`Ese animal no existe o ha sido libreado`);
                    }
                    else {
                        console.log('Animal liberado con éxito: ' + doc);
                        res.send('Animal liberado con éxito: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        //Cambiar los datos de un animal indicando el nombre del animal a actualizar
        this.actualiza = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const { especie, peso, altura, curado, operaciones } = req.body;
            yield database_1.db.conectarBD();
            yield Animal_1.Animales.findOneAndUpdate({ _nombre: nombre }, {
                _nombre: nombre,
                _especie: especie,
                _peso: peso,
                _altura: altura,
                _curado: curado,
                _operaciones: operaciones
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => {
                if (doc == null) {
                    console.log('El animal no existe o ha sido liberado');
                    res.json({ "Error": "No existe: " + nombre });
                }
                else {
                    console.log('Animal actualizado: ' + doc);
                    res.json(doc);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    //RUTAS 
    misRutas() {
        this._router.get('/', this.getAnimales);
        this._router.post('/nuevo', this.animalnuevoPost);
        // this._router.get('/nuevoget/:nombre&:especie&:peso&:altura&:curado&:operaciones', this.animalnuevoget)
        this._router.get('/jaula/:nombre', this.jaula);
        this._router.get('/comida/:nombre', this.comida);
        this._router.get('/total/:nombre', this.total);
        this._router.get('/liberar/:nombre', this.liberarAnimal);
        this._router.post('/actualizar/:nombre', this.actualiza);
    }
}
const obj = new rutasAnimales();
obj.misRutas();
exports.RutasAnimales = obj.router;
