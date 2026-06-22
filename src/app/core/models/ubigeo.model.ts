export interface Department{
    codigo:string,
    nombre:string,
}

export interface Province{
    codigo: string,
    nombre: string,
    departamento: string,
}

export interface District{
    codigo: string,
    nombre: string,
    provincia:string,
    departamento:string,
}