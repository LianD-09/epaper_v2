```mermaid

sequenceDiagram
    actor U as Người dùng 
    actor D as Thiết bị EPD
    participant V as NewDataView
    participant C as DataController
    participant S as DataService
    participant M as DataModel
    participant M1 as DeviceModel
    participant B as MQTT Broker

    activate U

    U->>+V: Chọn dữ liệu cần hiển thị
    V-->>-U: 
    U->>+V: handleSubmit()
    alt using BLE
        V->>+C: updateDataNoMqtt()
        C->>+S: updateDataNoMqtt()
        S->>+M1: findOne()
        M1->>S: Device
        S->>M1: findByIdAndUpdate()
        M1-->>-S: Device
        S->>+M: findByIdAndUpdate()
        M-->>-S: Data 
        S-->>-C: Data
        C-->>-V: Data
        V->>+D: show()
        D-->>-V: 
        else
        V->>+C: updateData()
        C->>+S: updateData()
        S->>+M1: findByIdAndUpdate()
        M1-->>-S: Device
        S->>+M: findByIdAndUpdate()
        M-->>-S: Data 
        S->>+B: publish()
        B->>+D: show()
        D-->>-B: writeOK
        B-->>-S: writeOK
        S-->>-C: Data
        C-->>-V: Data
    end
    V-->>-U: 

    deactivate U
