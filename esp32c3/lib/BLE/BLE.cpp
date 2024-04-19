#include <BLE.h>

static NimBLEServer *pServer;

/**  None of these are required as they will be handled by the library with defaults. **
 **                       Remove as you see fit for your needs                        */
class ServerCallbacks : public NimBLEServerCallbacks
{
    void onConnect(NimBLEServer *pServer)
    {
        Serial.println("Client connected");
        Serial.println("Multi-connect support: start advertising");
        NimBLEDevice::startAdvertising();
    };
    /** Alternative onConnect() method to extract details of the connection.
     *  See: src/ble_gap.h for the details of the ble_gap_conn_desc struct.
     */
    void onConnect(NimBLEServer *pServer, ble_gap_conn_desc *desc){};
    void onDisconnect(NimBLEServer *pServer)
    {
        Serial.println("Client disconnected - start advertising");
        NimBLEDevice::startAdvertising();
    };
    void onMTUChange(uint16_t MTU, ble_gap_conn_desc *desc)
    {
        Serial.printf("MTU updated: %u for connection ID: %u\n", MTU, desc->conn_handle);
    };

    /********************* Security handled here **********************
    ****** Note: these are the same return values as defaults ********/
    uint32_t onPassKeyRequest()
    {
        Serial.println("Server Passkey Request");
        /** This should return a random 6 digit number for security
         *  or make your own static passkey as done here.
         */
        return 123456;
    };

    bool onConfirmPIN(uint32_t pass_key)
    {
        Serial.print("The passkey YES/NO number: ");
        Serial.println(pass_key);
        /** Return false if passkeys don't match. */
        return true;
    };

    void onAuthenticationComplete(ble_gap_conn_desc *desc)
    {
        /** Check that encryption was successful, if not we disconnect the client */
        if (!desc->sec_state.encrypted)
        {
            NimBLEDevice::getServer()->disconnect(desc->conn_handle);
            Serial.println("Encrypt connection failed - disconnecting client");
            return;
        }
        Serial.println("Starting BLE work!");
    };
};

/** Handler class for characteristic actions */
class CharacteristicCallbacks : public NimBLECharacteristicCallbacks
{
};

/** Handler class for descriptor actions */
class DescriptorCallbacks : public NimBLEDescriptorCallbacks
{
    void onWrite(NimBLEDescriptor *pDescriptor)
    {
        std::string dscVal = pDescriptor->getValue();
        Serial.print("Descriptor witten value:");
        Serial.println(dscVal.c_str());
    };

    void onRead(NimBLEDescriptor *pDescriptor)
    {
        Serial.print(pDescriptor->getUUID().toString().c_str());
        Serial.println(" Descriptor read");
    };
};

void init(const std::string &deviceName)
{
    NimBLEDevice::init(deviceName);
}