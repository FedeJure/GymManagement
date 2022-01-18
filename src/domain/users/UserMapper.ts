import { User } from "./User"
import { UserPayload } from "./UserPayload"
import { UserType } from "./UserType"

interface UserExcel {
    Id?: string,
    Tipo: string,
    Nombre: string,
    Apellido: string,
    ["Email de contacto"]: string,
    ["Telefono de contacto"]: string,
    Direccion: string,
    ['Fecha de nacimiento']: number,
    Comentario: string,
    Hermanos: string,
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
        familiarIds: JSON.parse(excelMapped.Hermanos),
        profilePicture: excelMapped.Foto,
        dni: excelMapped.Dni

    })
}

export const mapToExcel = (excelMapped: User): UserExcel => {
    return ({
        Id: excelMapped.id,
        Tipo: excelMapped.type,
        Nombre: excelMapped.name,
        Apellido: excelMapped.lastname,
        // eslint-disable-next-line
        ["Email de contacto"]: excelMapped.contactEmail,
        // eslint-disable-next-line
        ["Telefono de contacto"]: excelMapped.contactPhone,
        Direccion: excelMapped.address,
        // eslint-disable-next-line
        ['Fecha de nacimiento']: excelMapped.birthDate.getTime(),
        Comentario: excelMapped.comment,
        Hermanos: JSON.stringify(excelMapped.familiarIds),
        Foto: excelMapped.profilePicture,
        Dni: excelMapped.dni
    })
}