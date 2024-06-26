```mermaid 
sequenceDiagram
    actor U as Người dùng 
    actor D as Thiết bị EPD
    participant V as NewDeviceView
    participant C as DeviceController
    participant S as DeviceService
    participant M as DeviceModel
    participant B as MQTT Broker

    activate U

    U->>+V: scanBLEDevices()
    V->>V: showBLEDevices()
    V-->>-U: 
    U->>+V: Chọn thiết bị
    V->>D: connectESP()
    activate D
    D-->>V: 
    deactivate D 
    V->>V: showCreateForm()
    V-->>-U: 
    U->>+V: handleSubmit()
    V->>+C: createDevice()
    alt exited device
    C->>+S: updateDeviceNoMqtt()
    S->>+M: findByIdAndUpdate()
    M-->>-S: Device 
    else 
    C->>S: createDevice()
    S->>+M: create()
    M-->>-S: Device 
    S->>+B: subscribe()
    B-->>-S: acknowledge
    end
    S-->>-C: Device
    C-->>-V: Device
    V->>+D: write()
    D->>+B: subscribe()
    B-->>-D: acknowledge
    D-->>-V: 
    V-->>-U: 

    deactivate U
