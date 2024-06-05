#ifndef __BLE_H
#define __BLE_H

#include <NimBLEDevice.h>
#include <Utils.h>
#include <Display.h>
#include <Arduino.h>
#include <DEV_Config.h>
#include <EPD_2in9_V2.h>
#include <Paint.h>
#include <Display.h>
#include <ota.h>

#define WIFI_SRV_UUID "00001a10-0000-1000-8000-00805f9b34fb"
#define WIFI_CHR_SSID_UUID "00001a11-0000-1000-8000-00805f9b34fb"
#define WIFI_CHR_PASSWORD_UUID "00001a12-0000-1000-8000-00805f9b34fb"
#define WIFI_CHR_DID_UUID "00001a13-0000-1000-8000-00805f9b34fb"
#define WIFI_CHR_TOPICID_UUID "00001a14-0000-1000-8000-00805f9b34fb"
#define WIFI_CHR_RESTART_UUID "00001a1f-0000-1000-8000-00805f9b34fb"

#define DATA_SRV_UUID "00001a20-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_TYPE_UUID "00001a2f-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_NAME_UUID "00001a21-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_INPUT2_UUID "00001a22-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_INPUT3_UUID "00001a23-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_INPUT4_UUID "00001a24-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_INPUT5_UUID "00001a25-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_IMAGE_UUID "00001a2b-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_ID_UUID "00001a2c-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_FONT_UUID "00001a2d-0000-1000-8000-00805f9b34fb"
#define DATA_CHR_SCHEMA_UUID "00001a2e-0000-1000-8000-00805f9b34fb"

class ServerCallbacks : public NimBLEServerCallbacks
{
    void onConnect(NimBLEServer *pServer);
    void onConnect(NimBLEServer *pServer, ble_gap_conn_desc *desc);
    void onDisconnect(NimBLEServer *pServer);
    void onMTUChange(uint16_t MTU, ble_gap_conn_desc *desc);
    uint32_t onPassKeyRequest();
    bool onConfirmPIN(uint32_t pass_key);
    void onAuthenticationComplete(ble_gap_conn_desc *desc);
};

/** Handler class for characteristic actions */
class CharacteristicCallbacks : public NimBLECharacteristicCallbacks
{
    void onWrite(NimBLECharacteristic *pCharacteristic);
    void onRead(NimBLECharacteristic *pCharacteristic);
};

/** Handler class for descriptor actions */
class DescriptorCallbacks : public NimBLEDescriptorCallbacks
{
    void onWrite(NimBLEDescriptor *pDescriptor);
    void onRead(NimBLEDescriptor *pDescriptor);
};

void BLE_Init(const std::string &deviceName);

void BLE_Advertise(UBYTE *BlackImage);

void BLE_Loop(UBYTE *BlackImage);

#endif