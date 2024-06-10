// db -> data syntax in DB
// sign -> data syntax to compare in ESP

export const fonts = [
    {
        db: "Monospace 12pt",
        sign: 'F12'
    },
    {
        db: "Monospace 16pt",
        sign: "F16"
    },
    {
        db: "Monospace 20pt",
        sign: "F20"
    },
    {
        db: "Segoe UI Light, 11pt",
        sign: "s11"
    },
    {
        db: "Segoe UI Bold, 11pt",
        sign: "S11"
    },
    {
        db: "Segoe UI Light, 16pt",
        sign: "s16"
    },
    {
        db: "Segoe UI Bold, 16pt",
        sign: "S16"
    },
    {
        db: "Segoe UI Light, 20pt",
        sign: "s20"
    },
];

export const themes = [
    {
        db: "Theme 1", sign: "1"
    },
    {
        db: "Theme 2", sign: "2"
    }
]

export const directions = [
    'horizontal',
    'vertical'
]

export const wifiServiceAndCharacteristic =
{
    name: "wifi",
    uuid: "00001a10-0000-1000-8000-00805f9b34fb",
    characteristics: {
        ssid: "00001a11-0000-1000-8000-00805f9b34fb",
        password: "00001a12-0000-1000-8000-00805f9b34fb",
        restart: "00001a1f-0000-1000-8000-00805f9b34fb",
        uniqueId: "00001a13-0000-1000-8000-00805f9b34fb",
        topicId: "00001a14-0000-1000-8000-00805f9b34fb",
    }
};
export const dataServiceAndCharacteristic = {
    name: "data",
    uuid: "00001a20-0000-1000-8000-00805f9b34fb",
    characteristics: {
        type: "00001a2f-0000-1000-8000-00805f9b34fb",
        name: "00001a21-0000-1000-8000-00805f9b34fb",
        input2: "00001a22-0000-1000-8000-00805f9b34fb",
        input3: "00001a23-0000-1000-8000-00805f9b34fb",
        input4: "00001a24-0000-1000-8000-00805f9b34fb",
        input5: "00001a25-0000-1000-8000-00805f9b34fb",
        image: "00001a2b-0000-1000-8000-00805f9b34fb",
        dataId: "00001a2c-0000-1000-8000-00805f9b34fb",
        font: "00001a2d-0000-1000-8000-00805f9b34fb",
        schema: "00001a2e-0000-1000-8000-00805f9b34fb",
    }
};

export const MAX_MTU = 255; // Adjust based on BLE packet size limitation (2 bytes lenght + 256 bytes + 2 bytes checksum + 1 flag)