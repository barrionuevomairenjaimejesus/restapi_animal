import {Schema, model } from 'mongoose'

export class Animal{
    private _nombre: string
    private _especie: string
    private _peso: number
    private _altura: number
    private _curado: boolean
    private _operaciones: number

    constructor(nombre:string, especie: string, peso : number, altura : number, curado : boolean, operaciones: number
        ){
        this._nombre = nombre
        this._especie = especie
        this._peso = peso
        this._altura = altura
        this._curado = false
        this._operaciones = operaciones
    }

    get nombre(){
        return this._nombre
    }

    get especie(){
        return this._especie
    }

    get peso(){
        return this._peso
    }

    get altura(){
        return this._altura
    }

    get curado(){
        return this._curado
    }

    get operaciones(){
        return this._operaciones
    }

    set altura(_altura: number){
        if (_altura <= -0.1){ //Uso -0.1 para que los animales que midan 0.4 metros por ejemplo entren en la BD
            throw "ERROR!! Un animal debe de medir algo para poder existir"
        }
        this._altura = _altura
    }
    set peso(_peso: number){
        if (_peso <= -0.1){ //Uso -0.1 para que los animales que pesen 0.4 kilos por ejemplo entren en la BD
            throw "ERROR!! Un animal debe de pesar algo para existir"
        }
        this._peso = _peso
    }
//Comenzamos a hacer todos los metodos que usaremos 

/*
 curar(){ //Con esto solo tendremos que cambiar el estado del animal para poder liberarlo (es un campo boolean) 
    let curar2=this._curado    //MÉTODO QUE NO FUNCIONA
    if (this._curado==false){
            curar2= true
            return "Estado de animal cambiado, listo para liberación"
        } else {
            return "Algo ha salido mal"
        }

    }
*/

    jaula(){
        let jaula: number
        jaula = this._altura*2
        if (isNaN(this._altura)){
            throw "No has introducido una altura, jaula no creada"
        }
        return jaula
    }

    comida(){
        let comida: number
        comida=this._peso*0.5 // Vamos a suponer que cada animal consume la mitad de su peso a la semana en comida
        if (isNaN(this._peso)){
            throw "No has introducido un peso, no podemos asignar la comida"
        }
        return comida
    }

    precioComida(){
        let precomida: number
        precomida= (this._peso*0.5)*3 // Suponemos que la comida se compra al por mayor y que no importa el tipo de comida 
        if (isNaN(this._peso)){
            throw "No has introducido un peso, no podemos calcular el precio de la comida"
        }
        return precomida
    }


    precioOperacion(){
        let preoperacion: number
        preoperacion = (this._operaciones*200) // Suponemos que el precio medio de una operación varia entre los 200 euros  
        if (this._operaciones >= 8){
            throw "No podemos hacernos cargo de este animal, necesita demasiadas operaciones"
        }
        return preoperacion
    }
    total(){
        let total: number
        total = (this._operaciones*200)+((this._peso*0.5)*2) // Usamos todas las cuentas al mismo tiempo.  
        if (this._operaciones >= 8 ){
            throw "No podemos hacernos cargo de este animal, necesita demasiadas operaciones"
        }
        if (isNaN(this._peso)){
            throw "No has introducido un peso, no podemos calcular el precio de la comida"
        }
        return total
    }
}

// Definimos el type

export type tAnimal = {
    _nombre: string,
    _especie: string,
    _peso: number,
    _altura: number,
    _curado: boolean,
    _operaciones: number
}

// Definimos el Schema
const animalSchema = new Schema({
    _nombre: {
        type: String,
        unique: true //Suponemos que nombre solo hay uno y único
    },
    _especie: String,
    _peso: Number,
    _altura: Number,
    _curado: Boolean,
    _operaciones: {
        type: Number,
        max: 8 //Si el animal necesita más de 8 operaciones este refugio no podrá hacerse cargo de el.
    }
})


export const Animales = model('Animales', animalSchema)
