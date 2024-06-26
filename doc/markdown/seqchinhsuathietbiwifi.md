```mermaid
sequenceDiagram
    actor U as Người dùng 
    actor D as Thiết bị EPD
    participant V as WifiRemoteControlView
    participant S as DeviceService
    participant M as DeviceModel
    participant B as MQTT Broker

    activate U

    U->>+V: handleScanWifi()
    V->>+D: Gửi yêu cầu quét các mạng Wifi
    D-->>-V: Thông tin các mạng wifi
    V->>V: showWifiNetworks()
    V-->>-U: 
    U->>+V: Chọn mạng wifi
    V->>V: showForm()
    V-->>-U: 
    U->>+V: handleSubmit()
    V->>+D: Lưu thông tin thiết bị
    D-->>-V: Lưu thông tin thành công
    V-->>-U: 
    U->>+V: handleRestart()
    V->>+D: Gửi yêu cầu khởi động lại
    D->>D: Kết nối vào mạng
    alt connected wifi
    D->>+B: publish()
    B->>+S: updateDevice()
    S-->>-B: Device
    B-->>-D: adhocOK
    end
    D-->>-V: Khởi động thành công
    V-->>-U: 

    deactivate U
