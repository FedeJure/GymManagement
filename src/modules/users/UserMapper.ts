import { User } from "./User"
import { UserPayload } from "./UserPayload"
import { UserType } from "./UserType"

interface UserExcel {
    Id?: number,
    Tipo: string,
    Nombre: string,
    Apellido: string,
    ["Email de contacto"]: string,
    ["Telefono de contacto"]: string,
    Direccion: string,
    ['Fecha de nacimiento']: number,
    Comentario: string,
    Hermanos: string,
    Suscripciones: string,
    Foto: string,
    Dni: string
}

export const mapFromExcel = (excelMapped: UserExcel): UserPayload => {
    return ({
        type: excelMapped.Tipo as UserType,
        name: excelMapped.Nombre,
        lastname: excelMapped.Apellido,
        contactEmail: excelMapped["Email de contacto"],
        contactPhone: excelMapped["Telefono de contacto"],
        address: excelMapped.Direccion,
        birthDate: new Date(excelMapped["Fecha de nacimiento"]),
        comment: excelMapped.Comentario,
        brothers: JSON.parse(excelMapped.Hermanos),
        productsSubscribed: JSON.parse(excelMapped.Suscripciones),
        profilePicture: excelMapped.Foto,
        dni: excelMapped.Dni

    })
}

export const mapToExcel = (excelMapped: User): UserExcel => {
    return ({
        Id: excelMapped.id,
        Tipo: excelMapped.data.type,
        Nombre: excelMapped.data.name,
        Apellido: excelMapped.data.lastname,
        // eslint-disable-next-line
        ["Email de contacto"]: excelMapped.data.contactEmail,
        // eslint-disable-next-line
        ["Telefono de contacto"]: excelMapped.data.contactPhone,
        Direccion: excelMapped.data.address,
        // eslint-disable-next-line
        ['Fecha de nacimiento']: excelMapped.data.birthDate.getTime(),
        Comentario: excelMapped.data.comment,
        Hermanos: JSON.stringify(excelMapped.data.brothers),
        Suscripciones: JSON.stringify(excelMapped.data.productsSubscribed),
        Foto: excelMapped.data.profilePicture,
        Dni: excelMapped.data.dni
    })
}