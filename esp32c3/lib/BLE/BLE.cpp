#include <BLE.h>
using namespace std;

NimBLEServer *pServer;
string serverName;

vector<json_pattern> jType;

uint8_t _update; // 0 - no update
                 // 1 - write1 update
                 // 2 - write2 update
                 // 3 - write3 update
                 // 4 - write4 update
                 // 5 - write5 update
                 // 6 - ping update
                 // 7 - device update
                 // 8 - remove update
                 // 9 - restart
const int connectTimeout = 20000;

void display_on_message(UBYTE *BlackImage)
{
    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    if (_update == 1)
    {
        String oldData = preferences.getString("oldData", "");
        displayWrite1(BlackImage);

        String writeOK = "writeOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        _update = 0;
    }
    else if (_update == 2)
    {
        String oldData = preferences.getString("oldData", "");
        displayWrite2(BlackImage);

        String writeOK = "writeOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        _update = 0;
    }
    else if (_update == 3)
    {
        String oldData = preferences.getString("oldData", "");
        displayWrite3(BlackImage);

        String writeOK = "writeOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        _update = 0;
    }
    else if (_update == 4)
    {
        String oldData = preferences.getString("oldData", "");
        displayWrite4(BlackImage);

        String writeOK = "writeOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        _update = 0;
    }
    else if (_update == 5)
    {
        String oldData = preferences.getString("oldData", "");
        displayWrite5(BlackImage);

        String writeOK = "writeOK|";
        writeOK += oldData;
        Serial.println(writeOK.c_str());

        _update = 0;
    }
    else if (_update == 6)
    {
        String dataID = preferences.getString("dataID", "");
        String writeOK = "pingOK|";
        writeOK += dataID;
        Serial.println(writeOK.c_str());
        _update = 0;
    }
    else if (_update == 7)
    {
        String ssid = preferences.getString("ssid", "");
        String password = preferences.getString("pass", "");
        String dataID = preferences.getString("dataID", "");
        int dataType = preferences.getInt("dataType", 0);

        EPD_2IN9_V2_Init();
        String updateOK = "updateOK|";
        Serial.println(updateOK.c_str());
        _update = 0;
    }
    else if (_update == 8)
    {
        preferences.putString("font", "");
        preferences.putString("schema", "");
        preferences.putString("name", "");
        preferences.putString("input2", "");
        preferences.putString("input3", "");
        preferences.putString("input4", "");
        String dataID = preferences.getString("dataID", "");
        String removeOK = "removeOK|";
        removeOK += dataID;
        Serial.println(removeOK.c_str());
        preferences.putString("dataID", "");
        preferences.putInt("dataType", 0);
        displayEmpty(BlackImage);
        _update = 0;
    }
    else if (_update == 9)
    {
        Serial.println("Restarting...");
        DEV_Delay_ms(1000);
        ESP.restart();
    }
    DEV_Delay_ms(5000);
}

void ServerCallbacks::onConnect(NimBLEServer *pServer)
{
    Serial.println("Client connected");
    Serial.println("Multi-connect support: start advertising");
    NimBLEDevice::startAdvertising();
};
void ServerCallbacks::onConnect(NimBLEServer *pServer, ble_gap_conn_desc *desc) {};
void ServerCallbacks::onDisconnect(NimBLEServer *pServer)
{
    Serial.println("Client disconnected - start advertising");
    NimBLEDevice::startAdvertising();
};
void ServerCallbacks::onMTUChange(uint16_t MTU, ble_gap_conn_desc *desc)
{
    Serial.printf("MTU updated: %u for connection ID: %u\n", MTU, desc->conn_handle);
};

uint32_t ServerCallbacks::onPassKeyRequest()
{
    Serial.println("Server Passkey Request");
    /** This should return a random 6 digit number for security
     *  or make your own static passkey as done here.
     */
    return 123456;
};

bool ServerCallbacks::onConfirmPIN(uint32_t pass_key)
{
    Serial.print("The passkey YES/NO number: ");
    Serial.println(pass_key);
    /** Return false if passkeys don't match. */
    return true;
};

void ServerCallbacks::onAuthenticationComplete(ble_gap_conn_desc *desc)
{
    /** Check that encryption was successful, if not we disconnect the client */
    if (!desc->sec_state.encrypted)
    {
        NimBLEDevice::getServer()->disconnect(desc->conn_handle);
        Serial.println("Encrypt connection failed - disconnecting client");
        return;
    }

    std::string id = uint8_to_hex_string(desc->peer_id_addr.val, sizeof(desc->peer_id_addr.val));
    Serial.println(id.c_str());
    Serial.println("Starting BLE work!");
};

// Characteristic callback
void CharacteristicCallbacks::onWrite(NimBLECharacteristic *pCharacteristic)
{
    std::string chrVal = pCharacteristic->getValue();
    std::string chrUUID = pCharacteristic->getUUID();
    Serial.print("Characteristic witten value:");
    Serial.println(chrVal.c_str());
    // Wifi write
    if (chrUUID.compare(WIFI_CHR_SSID_UUID) == 0)
    {
        preferences.putString("ssid", chrVal.c_str());
    }
    if (chrUUID.compare(WIFI_CHR_PASSWORD_UUID) == 0)
    {
        preferences.putString("pass", chrVal.c_str());
    }
    if (chrUUID.compare(WIFI_CHR_TOPICID_UUID) == 0)
    {
        preferences.putString("_id", chrVal.c_str());
    }
    // Restart and write value to 0
    if (chrUUID.compare(WIFI_CHR_RESTART_UUID) == 0)
    {
        if (chrVal.compare("1") == 0)
        {
            _update = 9;
        }
    }
    // Data write
    if (chrUUID.compare(DATA_CHR_NAME_UUID) == 0)
    {
        preferences.putString("name", chrVal.c_str());
    }
    if (chrUUID.compare(DATA_CHR_INPUT2_UUID) == 0)
    {
        preferences.putString("input2", chrVal.c_str());
    }
    if (chrUUID.compare(DATA_CHR_INPUT3_UUID) == 0)
    {
        preferences.putString("input3", chrVal.c_str());
    }
    if (chrUUID.compare(DATA_CHR_INPUT4_UUID) == 0)
    {
        preferences.putString("input4", chrVal.c_str());
    }
    if (chrUUID.compare(DATA_CHR_INPUT5_UUID) == 0)
    {
        preferences.putString("input5", chrVal.c_str());
    }
    if (chrUUID.compare(DATA_CHR_FONT_UUID) == 0)
    {
        if (compareStrings(chrVal.c_str(), "F12"))
        {
            preferences.putString("font", "Font12");
        }
        else if (compareStrings(chrVal.c_str(), "F16"))
        {
            preferences.putString("font", "Font16");
        }
        else if (compareStrings(chrVal.c_str(), "F20"))
        {
            preferences.putString("font", "Font20");
        }
        else if (compareStrings(chrVal.c_str(), "s11"))
        {
            preferences.putString("font", "Segoe11");
        }
        else if (compareStrings(chrVal.c_str(), "S11"))
        {
            preferences.putString("font", "Segoe11Bold");
        }
        else if (compareStrings(chrVal.c_str(), "s16"))
        {
            preferences.putString("font", "Segoe16");
        }
        else if (compareStrings(chrVal.c_str(), "S16"))
        {
            preferences.putString("font", "Segoe16Bold");
        }
        else if (compareStrings(chrVal.c_str(), "s20"))
        {
            preferences.putString("font", "Segoe20");
        }
    }
    if (chrUUID.compare(DATA_CHR_SCHEMA_UUID) == 0)
    {
        preferences.putString("schema", chrVal.c_str());
    }
    if (chrUUID.compare(DATA_CHR_ID_UUID) == 0)
    {
        String oldData = preferences.getString("dataID", "");
        preferences.putString("dataID", chrVal.c_str());
        preferences.putString("oldData", oldData);
    }
    // Update when receive type value
    if (chrUUID.compare(DATA_CHR_TYPE_UUID) == 0)
    {
        if (compareStrings(chrVal.c_str(), "client"))
        {
            preferences.putInt("dataType", 1);
            _update = 1;
        }
        else if (compareStrings(chrVal.c_str(), "student"))
        {
            preferences.putInt("dataType", 2);
            _update = 2;
        }
        else if (compareStrings(chrVal.c_str(), "employee"))
        {
            preferences.putInt("dataType", 3);
            _update = 3;
        }
        else if (compareStrings(chrVal.c_str(), "product"))
        {
            preferences.putInt("dataType", 4);
            _update = 4;
        }
        else if (compareStrings(chrVal.c_str(), "room"))
        {
            preferences.putInt("dataType", 5);
            _update = 5;
        }
    }
};

void CharacteristicCallbacks::onRead(NimBLECharacteristic *pCharacteristic)
{
    Serial.print(pCharacteristic->getUUID().toString().c_str());
    Serial.println("Characteristic read");
};

// Descriptor callback
void DescriptorCallbacks::onWrite(NimBLEDescriptor *pDescriptor)
{
    std::string dscVal = pDescriptor->getValue();
    Serial.print("Descriptor witten value:");
    Serial.println(dscVal.c_str());
};
void DescriptorCallbacks::onRead(NimBLEDescriptor *pDescriptor)
{
    Serial.print(pDescriptor->getUUID().toString().c_str());
    Serial.println(" Descriptor read");
};

void BLE_Init(const std::string &deviceName)
{
    String topic = preferences.getString("_id", "");
    String ssid = preferences.getString("ssid", "");
    String password = preferences.getString("pass", "");
    String name = preferences.getString("name", "");
    int dataType = preferences.getInt("dataType", 0);
    String input2 = preferences.getString("input2", "");
    String input3 = preferences.getString("input3", "");
    String input4 = preferences.getString("input4", "");
    String input5 = preferences.getString("input5", "");
    String font = preferences.getString("font", "");
    String schema = preferences.getString("schema", "");
    String dataID = preferences.getString("dataID", "");

    Serial.println("Starting NimBLE Server");
    NimBLEDevice::init(deviceName);
    serverName = deviceName;
#ifdef ESP_PLATFORM
    NimBLEDevice::setPower(ESP_PWR_LVL_P9); /** +9db */
#else
    NimBLEDevice::setPower(9); /** +9db */
#endif
    ServerCallbacks *pCallBacks = new ServerCallbacks();
    NimBLEDevice::setSecurityAuth(true, true, true);
    NimBLEDevice::setSecurityPasskey(123456);
    NimBLEDevice::setSecurityIOCap(BLE_HS_IO_DISPLAY_ONLY);
    pServer = NimBLEDevice::createServer();
    pServer->setCallbacks(pCallBacks, true);
    // Wifi configuration service
    NimBLEService *pServiceWifi = pServer->createService(NimBLEUUID(WIFI_SRV_UUID));
    // SSID
    NimBLECharacteristic *pSsid = pServiceWifi->createCharacteristic(
        NimBLEUUID(WIFI_CHR_SSID_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pSsid->setValue(ssid);
    pSsid->setCallbacks(new CharacteristicCallbacks());
    pSsid->notify(true);
    // Password
    NimBLECharacteristic *pPass = pServiceWifi->createCharacteristic(
        NimBLEUUID(WIFI_CHR_PASSWORD_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pPass->setValue(password);
    pPass->setCallbacks(new CharacteristicCallbacks());
    pPass->notify(true);
    // Device ID - Unique ID
    NimBLECharacteristic *pDID = pServiceWifi->createCharacteristic(
        NimBLEUUID(WIFI_CHR_DID_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN);
    pDID->setValue(ESP.getEfuseMac());
    pDID->setCallbacks(new CharacteristicCallbacks());
    pDID->notify(true);
    // Password
    NimBLECharacteristic *pTopicID = pServiceWifi->createCharacteristic(
        NimBLEUUID(WIFI_CHR_TOPICID_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pTopicID->setValue(topic);
    pTopicID->setCallbacks(new CharacteristicCallbacks());
    pTopicID->notify(true);
    // Restart call
    NimBLECharacteristic *pRestart = pServiceWifi->createCharacteristic(
        NimBLEUUID(WIFI_CHR_RESTART_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pRestart->setValue("0");
    pRestart->setCallbacks(new CharacteristicCallbacks());
    pRestart->notify(true);
    pServiceWifi->start();

    // Data service
    NimBLEService *pServiceData = pServer->createService(NimBLEUUID(DATA_SRV_UUID));
    // Type
    NimBLECharacteristic *pDataType = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_TYPE_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataType->setValue(dataType);
    pDataType->setCallbacks(new CharacteristicCallbacks());
    pDataType->notify(true);
    // Name
    NimBLECharacteristic *pDataName = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_NAME_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataName->setValue(name);
    pDataName->setCallbacks(new CharacteristicCallbacks());
    pDataName->notify(true);
    // Input2
    NimBLECharacteristic *pDataInput2 = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_INPUT2_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataInput2->setValue(input2);
    pDataInput2->setCallbacks(new CharacteristicCallbacks());
    pDataInput2->notify(true);
    // Input3
    NimBLECharacteristic *pDataInput3 = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_INPUT3_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataInput3->setValue(input3);
    pDataInput3->setCallbacks(new CharacteristicCallbacks());
    pDataInput3->notify(true);
    // Input4
    NimBLECharacteristic *pDataInput4 = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_INPUT4_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataInput4->setValue(input4);
    pDataInput4->setCallbacks(new CharacteristicCallbacks());
    pDataInput4->notify(true);
    // Input5
    NimBLECharacteristic *pDataInput5 = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_INPUT5_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataInput5->setValue(input5);
    pDataInput5->setCallbacks(new CharacteristicCallbacks());
    pDataInput5->notify(true);
    // Font
    NimBLECharacteristic *pDataFont = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_FONT_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataFont->setValue(font);
    pDataFont->setCallbacks(new CharacteristicCallbacks());
    pDataFont->notify(true);
    // Schema
    NimBLECharacteristic *pDataSchema = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_SCHEMA_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataSchema->setValue(schema);
    pDataSchema->setCallbacks(new CharacteristicCallbacks());
    pDataSchema->notify(true);
    // Data ID
    NimBLECharacteristic *pDataID = pServiceData->createCharacteristic(
        NimBLEUUID(DATA_CHR_ID_UUID),
        NIMBLE_PROPERTY::READ |
            NIMBLE_PROPERTY::READ_ENC |
            NIMBLE_PROPERTY::READ_AUTHEN |
            NIMBLE_PROPERTY::WRITE |
            NIMBLE_PROPERTY::WRITE_ENC |
            NIMBLE_PROPERTY::WRITE_AUTHEN);
    pDataID->setValue(dataID);
    pDataID->setCallbacks(new CharacteristicCallbacks());
    pDataID->notify(true);

    pServiceData->start();

    // create QR string
    jType.push_back(make_pair("name", serverName));
    jType.push_back(make_pair("type", "bluetooth"));
}

void BLE_Advertise(UBYTE *BlackImage)
{
    NimBLEAdvertising *pAdvertising = NimBLEDevice::getAdvertising();

    if (pAdvertising->isAdvertising() || pServer->getConnectedCount() > 0)
    {
        return;
    }

    pAdvertising->addServiceUUID(NimBLEUUID(WIFI_SRV_UUID));
    pAdvertising->addServiceUUID(NimBLEUUID(DATA_SRV_UUID));
    Serial.println("Starting to advertise...");
    pAdvertising->start();

    string text = create_json_string(jType);
    string encodeText = base64_encode(text).c_str();
    displayQRText(BlackImage, encodeText.c_str(), 3);
}

void BLE_Loop(UBYTE *BlackImage)
{
    if (pServer->getConnectedCount())
    {
        NimBLEService *pWifi = pServer->getServiceByUUID("00001A10-0000-1000-8000-00805f9b34fb");
        if (pWifi)
        {
            NimBLECharacteristic *pChr1 = pWifi->getCharacteristic("00001A11-0000-1000-8000-00805f9b34fb");
            NimBLECharacteristic *pChr2 = pWifi->getCharacteristic("00001A12-0000-1000-8000-00805f9b34fb");
            if (pChr1)
            {
                pChr1->notify(true);
            }
            if (pChr2)
            {
                pChr2->notify(true);
            }
        }
    }

    Serial.println("BLE loop");
    display_on_message(BlackImage);
}