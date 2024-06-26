```mermaid

sequenceDiagram
    actor U as Người dùng 
    actor D as Thiết bị EPD
    participant V as DeviceDashboardView
    participant C as DeviceController
    participant S as DeviceService
    participant M as DeviceModel
    participant M1 as DataModel
    participant B as MQTT Broker

    activate U

    U->>+V: deleteItem()
    V->>V: showDeleteConfim()
    V-->>U: 
    U->>V: Chọn Xác nhận
    V->>+C: deleteDevice()
    C->>+S: deleteDevice()
    S->>+M: findById()
    M-->>S: Device
    alt is display
    S->>+B: publish()
    B->>+D: remove()
    D-->>-B: removeOK
    B-->>-S: removeOK
    end
    S->>+M1: findById()
    M1-->>S: Data
    S->>M1: findByIdAndUpdate()
    M1-->>-S: 
    S->>M: findByIdAndDelete()
    M-->>-S:   
    S-->>-C: Device
    C-->>-V: Device
    V-->>-U: 

    deactivate U
