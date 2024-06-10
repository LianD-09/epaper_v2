#include <DEV_Config.h>
#include <EPD_2in9_V2.h>
#include <Paint.h>
#include <MQTT.h>
#include <debug.h>
#include <Display.h>
#include <ota.h>
#include <stdlib.h>
#include <BLE.h>

// change larger loop stack space - default 8192
SET_LOOP_TASK_STACK_SIZE(16 * 1024)

using namespace std;

#define ENABLE_BLUETOOTH 1
#define MODE_BUTTON_PIN 20

String wifiName;
Preferences preferences;
UBYTE *BlackImage;
UWORD Imagesize = ((EPD_2IN9_V2_WIDTH % 8 == 0) ? (EPD_2IN9_V2_WIDTH / 8) : (EPD_2IN9_V2_WIDTH / 8 + 1)) * EPD_2IN9_V2_HEIGHT;
uint64_t chipid = ESP.getEfuseMac();
int mode = 0;
portMUX_TYPE mux = portMUX_INITIALIZER_UNLOCKED;

void IRAM_ATTR ISR_Mode()
{
    portENTER_CRITICAL_ISR(&mux);
    static unsigned long last_interrupt_time = 0;
    unsigned long interrupt_time = millis();

    if (interrupt_time - last_interrupt_time > 200)
    {
        // debounce the button press
        Serial.print("Button press");
        mode = (mode + 1) % 2;
        last_interrupt_time = interrupt_time;
    }
    portEXIT_CRITICAL_ISR(&mux);
}

void setup()
{
    Serial.begin(115200);

    pinMode(MODE_BUTTON_PIN, INPUT_PULLUP);
    attachInterrupt(MODE_BUTTON_PIN, ISR_Mode, FALLING);
    Serial.println("epd say hi");
    pinMode(2, OUTPUT); // Initialize the built-in LED pin as an output
    digitalWrite(2, LOW);
    DEV_Delay_ms(1000);
    pinMode(9, INPUT_PULLUP);
    DEV_Module_Init();

    EPD_2IN9_V2_Init();
    EPD_2IN9_V2_Clear();
    DEV_Delay_ms(500);

    // Create a new image cache
    /* you have to edit the startup_stm32fxxx.s file and set a big enough heap size */
    if ((BlackImage = (UBYTE *)malloc(Imagesize)) == NULL)
    {
        printf("Failed to apply for black memory...\r\n");
        while (1)
            ;
    }
    printf("Paint_NewImage\r\n");
    Paint_NewImage(BlackImage, EPD_2IN9_V2_WIDTH, EPD_2IN9_V2_HEIGHT, 90, WHITE);
    Serial.println(uxTaskGetStackHighWaterMark(NULL));
#if 1
    preferences.begin("my-app", false);
    wifiName = "AP-" + String(chipid);

    // bool debugMode = preferences.getBool("debugMode", false);
    // if (debugMode)
    // {
    //     enterDebugMode(BlackImage);
    //     preferences.putBool("debugMode", false); // Clear flag
    //     ESP.restart();
    // }

    Paint_Clear(0xff);
    const char *Welcome = "Epaper Project";
    UWORD x;

    x = alignSegoe(Welcome, &Segoe16Bold, 50);
    Paint_DrawString_segment(x, 40, Welcome, &Segoe16Bold, BLACK, WHITE);
    EPD_2IN9_V2_Display(BlackImage);

    Paint_ClearWindows(30, 70, 30 + 14 * 15, 70 + Segoe11.Height, WHITE);
    x = alignSegoe("Initializing", &Segoe11Bold, 50);
    Paint_DrawString_segment(x, 70, "Initializing", &Segoe11, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);
    DEV_Delay_ms(3000);

    x = alignSegoe("Getting local data", &Segoe11Bold, 50);
    Paint_ClearWindows(30, 70, 30 + 14 * 15, 70 + Segoe11.Height, WHITE);
    Paint_DrawString_segment(x, 70, "Getting local data", &Segoe11, BLACK, WHITE);
    EPD_2IN9_V2_Display_Partial(BlackImage);

    // Get Preferences local data
    String ssid = preferences.getString("ssid", "");
    String password = preferences.getString("pass", "");
    String topic = preferences.getString("_id", "");
    String active = preferences.getString("active", "false");
    String dataID = preferences.getString("dataID", "");
    int dataType = preferences.getInt("dataType", 0);

    Serial.println(ssid);
    Serial.println(password);
    Serial.println(topic);
    Serial.println(active);
    Serial.println(dataID);
    Serial.println(dataType);

    if (!ssid.isEmpty() && !password.isEmpty())
    {
        // If SSID and password are available in Preferences, use them to connect to Wi-Fi
        MQTT_Client_Init(ssid.c_str(), password.c_str(), topic.c_str(), wifiName, BlackImage);
    }
    else
    {
        MQTT_Client_Init(SSID, PASS, topic.c_str(), wifiName, BlackImage);
    }
    MQTT_Connect(topic.c_str(), BlackImage);

    if (!dataID.isEmpty() && dataType != 0)
    {
        Paint_ClearWindows(30, 70, 30 + 14 * 20, 70 + Segoe11.Height, WHITE);
        Paint_DrawString_segment(70, 70, "Displaying stored data", &Segoe11, BLACK, WHITE);
        EPD_2IN9_V2_Display_Partial(BlackImage);

        if (dataType == 1)
        {
            displayWrite1(BlackImage);
        }
        else if (dataType == 2)
        {
            displayWrite2(BlackImage);
        }
        else if (dataType == 3)
        {
            displayWrite3(BlackImage);
        }
        else if (dataType == 4)
        {
            displayWrite4(BlackImage);
        }
        else if (dataType == 5)
        {
            displayWrite5(BlackImage);
        }
        else if (dataType == 6)
        {
            displayImage(BlackImage);
        }
    }
    else
    {
        displayEmpty(BlackImage);
    }
#endif

#if defined(ENABLE_BLUETOOTH)
    string deviceName = "EPD-" + to_string(chipid);
    BLE_Init(deviceName);
#endif
}

void loop()
{
    if (mode == 1)
    {
        BLE_Loop(BlackImage);
        BLE_Advertise(BlackImage);
    }

    // if (digitalRead(20) == LOW)
    // {
    //     Serial.print("press Pin 20");
    //     mode = (mode + 1) % 2;
    //     DEV_Delay_ms(100);
    // }
#if 1
    if (digitalRead(9) == LOW)
    {                                      // Check if the button is pressed
        Serial.println("Button pressed!"); // Print a message to the serial monitor
        delay(500);                        // Debounce delay to avoid multiple detections
        EPD_2IN9_V2_Init();
        Paint_Clear(0xff);
        Paint_DrawString_segment(60, 40, "Enter Debugging mode", &Segoe16, BLACK, WHITE);
        EPD_2IN9_V2_Display(BlackImage);
        DEV_Delay_ms(2000);
        startDebugging();
    }

    static string did = "uniqueId:" + to_string(chipid);
    Serial.println(did.c_str());
    DEV_Delay_ms(500);

    static String key = "";
    static String value = "";
    static bool isKey = true;
    static bool updated = false;

    while (Serial.available())
    { // Check if data is available to read
        char c = Serial.read();
        if (c == ':')
        {
            isKey = false;
        }
        else if (c == '\n')
        {
            Serial.print("Received ");
            Serial.print(key);
            Serial.print(":");
            Serial.println(value);
            preferences.putString(key.c_str(), value);
            updated = true;
            key = "";
            value = "";
            isKey = true;
            DEV_Delay_ms(200);
        }
        else
        {
            if (isKey)
            {
                key += c;
            }
            else
            {
                value += c;
            }
        }
    }

    // Reconfig after Preferences update
    if (updated)
    {
        String ssid = preferences.getString("ssid", "");
        String password = preferences.getString("pass", "");
        String topic = preferences.getString("_id", "");
        String dataID = preferences.getString("dataID", "");
        int dataType = preferences.getInt("dataType", 0);

        EPD_2IN9_V2_Init();
        Paint_Clear(0xff);
        EPD_2IN9_V2_Display(BlackImage);
        MQTT_Client_Init(ssid.c_str(), password.c_str(), topic.c_str(), wifiName, BlackImage);
        MQTT_Connect(topic.c_str(), BlackImage);

        if (!dataID.isEmpty())
        {
            if (dataType == 1)
            {
                displayWrite1(BlackImage);
            }
            else if (dataType == 2)
            {
                displayWrite2(BlackImage);
            }
            else if (dataType == 3)
            {
                displayWrite3(BlackImage);
            }
            else if (dataType == 4)
            {
                displayWrite4(BlackImage);
            }
            else if (dataType == 5)
            {
                displayWrite5(BlackImage);
            }
        }
        else
        {
            displayEmpty(BlackImage);
        }
        MQTT_Loop(topic.c_str(), wifiName, BlackImage);
        updated = false;
    }
    else
    {
        String topic = preferences.getString("_id", "");
        MQTT_Loop(topic.c_str(), wifiName, BlackImage);
    }
    printf("loop done, updated = %d\r\n", updated);
#endif
}
