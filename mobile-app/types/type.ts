export enum Status {
    ACTIVE,
    INACTIVE,
    PENDING,
    UNKNOWN,
}

export enum DataType {
    CLIENT = "client",
    STUDENT = "student",
    EMPLOYEE = "employee",
    PRODUCT = "product",
    ROOM = "room",
    IMAGE = "image",
}

export type User = {
    id: string | number,
    email: string,
    name: string,
    gender: number,
    createdAt?: string,
    updatedAt?: string,
}

export type UserRaw = {
    _id: string | number,
    email: string,
    name: string,
    gender: number,
    createdAt?: string,
    updatedAt?: string,
}

export type Device = {
    active: boolean,
    createdBy: string | number,
    dataID: string | number,
    dataName: string,
    name: string,
    pass: string
    ssid: string
    id: string | number,
}

export type Product = {
    id: string | number,
    name: string,
    category: string,
    price: string,
    active: boolean,
    activeStartTime: number,
    deviceName: string,
    deviceID: string | number,
    activeTimestamp: Array<string>,
    fontStyle: string,
    designSchema: string,
    createdBy: string | number,
}

export type Student = {
    id: string | number,
    name: string,
    email: string,
    studentId: string,
    class: string,
    active: boolean,
    activeStartTime: number,
    deviceName: string,
    deviceID: string | number,
    activeTimestamp: Array<string>,
    fontStyle: string,
    designSchema: string,
    createdBy: string | number,
}

export type Employee = {
    id: string | number,
    name: string,
    email: string,
    employeeId: string,
    department: string,
    active: boolean,
    activeStartTime: number,
    deviceName: string,
    deviceID: string | number,
    activeTimestamp: Array<string>,
    fontStyle: string,
    designSchema: string,
    createdBy: string | number,
}

export type Client = {
    id: string | number,
    name: string,
    email: string,
    address: string,
    active: boolean,
    activeStartTime: number,
    deviceName: string,
    deviceID: string | number,
    activeTimestamp: Array<string>,
    fontStyle: string,
    designSchema: string,
    createdBy: string | number,
}

export type Room = {
    id: string | number,
    name: string,
    purpose: string,
    manager: string,
    roomStatus: string,
    active: boolean,
    activeStartTime: number,
    deviceName: string,
    deviceID: string | number,
    activeTimestamp: Array<string>,
    fontStyle: string,
    designSchema: string,
    createdBy: string | number,
}

export type Template = Product | Student | Room | Client | Employee;

export type DataRaw = {
    _id: string | number,
    type: string,
    name: string,
    // Client: Email
    // Student: Email
    // Employee: Email
    // Product:  Category
    // Room:     Purpose
    input2?: string | null,
    // Client:   Address
    // Student:  Student ID
    // Employee: Employee ID
    // Product:  Price
    // Room:     Manager
    input3?: string | null,
    // Student:  Class
    // Employee: Department
    // Room:     Status
    input4?: string | null,
    active: boolean,
    activeStartTime: number,
    deviceID: string | number,
    deviceName: string,
    activeTimestamp: Array<string>,
    fontStyle: string,
    designSchema: string,
    createdBy: string | number,
}