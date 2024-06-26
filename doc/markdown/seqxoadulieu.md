```mermaid
sequenceDiagram
    actor U as Người dùng 
    actor D as Thiết bị EPD
    participant V as DataDashboardView
    participant C as DataController
    participant S as DataService
    participant M as DataModel
    participant M1 as DeviceModel
    participant B as MQTT Broker

    activate U

    U->>+V: deleteItem()
    V->>V: showDeleteConfim()
    V-->>U: 
    U->>V: Chọn Xác nhận
    V->>+C: deleteData()
    C->>+S: deleteData()
    S->>+M: findById()
    M-->>S: Data
    alt is display
    S->>+B: publish()
    B->>+D: remove()
    D-->>-B: removeOK
    B-->>-S: removeOK
    end
    S->>+M1: findById()
    M1-->>S: Device
    S->>M1: findByIdAndUpdate()
    M1-->>-S: Device
    S->>M: findByIdAndDelete()
    M-->>-S: Data
    S-->>-C: Data
    C-->>-V: Data
    V-->>-U: 

    deactivate U
