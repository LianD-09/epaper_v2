export enum Status {
    ACTIVE,
    INACTIVE,
    PENDING,
    UNKNOWN,
}

export enum DataType {
    PRODUCT,
    STUDENT,
    EMPLOYEE,
    CLIENT,
    ROOM,
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
    email: string,
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
    type: string,
    name: string,
    // Client
    // Student
    // Employee
    email: string,
    // Client:   Address
    // Student:  Student ID
    // Product:  Category
    // Employee: Employee ID
    // Room:     Purpose
    input2: string,
    // Student:  Class
    // Product:  Price
    // Employee: Department
    // Room:     Manager
    input3: string,
    // Room:     Status
    input4: string,
    active: boolean,
    activeStartTime: number,
    deviceID: string | number,
    deviceName: string,
    activeTimestamp: Array<string>,
    fontStyle: string,
    designSchema: string,
    createdBy: string | number,
}