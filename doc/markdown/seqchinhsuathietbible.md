```mermaid
sequenceDiagram
    actor U as Người dùng 
    actor D as Thiết bị EPD
    participant V as DeviceDashboardView
    participant C as DeviceController
    participant S as DeviceService
    participant M as DeviceModel
    participant M1 as DataModel

    activate U

    U->>+V: scanBLEDevices()
    V->>V: showBLEDevices()
    V-->>-U: 
    U->>+V: Chọn thiết bị
    V->>D: connectESP()
    activate D
    D-->>V: 
    deactivate D 
    V->>V: showForm()
    V-->>-U: 
    U->>+V: handleSubmit()
    V->>+C: updateDevice()
    C->>+S: updateDeviceNoMqtt()
    alt have data
    S->>+M1: findById()
    M1-->>S: Data
    S->>M1: findByIdUpdate()
    M1-->>-S: 
    end
    S->>+M: findByIdAndUpdate()
    M-->>-S: Device 
    S-->>-C: Device
    C-->>-V: Device
    V->>+D: write()
    D-->>-V: 
    V-->>-U: 

    deactivate U
