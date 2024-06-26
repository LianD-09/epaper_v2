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

    U->>+V: Chọn kiểu dữ liệu
    V->>V: showCreateForm()
    V-->>-U: 
    U->>+V: handleSubmit()
    alt using BLE
        V->>+C: createDataNoMqtt()
        C->>+S: createDataNoMqtt()
        alt display data
        S->>+M1: find()
        M1->>S: Array(Device)
        S->>M1: findByIdAndUpdate()
        M1-->>-S: Device
        end
        S->>+M: create()
        M-->>-S: Data
        S-->>-C: Data
        C-->>-V: Data
        alt display data
            V->>+D: show()
            D-->>-V: 
        end
        else
        V->>+C: createData()
        C->>+S: createData()
        alt display data
            S->>+M1: findByIdAndUpdate()
            M1-->>-S: Device
        end
        S->>+M: create()
        M-->>-S: Data 
        alt display data
            S->>+B: publish()
            B->>+D: show()
            D-->>-B: writeOK
            B-->>-S: writeOK
        end
        S-->>-C: Data
        C-->>-V: Data
    end
    V-->>-U: 

    deactivate U
