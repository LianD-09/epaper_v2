#ifndef __CONTROL_H
#define __CONTROL_H

class Control
{
private:
    /*
    Connect mode BLE or Wifi Adhoc
    0: No mode enable
    1: BLE mode
    2: WiFi Adhoc mode
    */
    static int mode;

    /*
    QR code shown mode
    0: No mode has been shown
    1: BLE mode
    2: WiFi Adhoc mode
    */
    static int current;

    // Show processing on EPD
    static bool showProcess;

public:
    static int getMode();
    static int getCurrent();
    static bool getShowProcess();
    static void setMode(int m);
    static void setCurrentByMode();
    static void setCurrentByMode(int m);
    static void setNextMode();
    static void setShowProcess(bool sP);
    static void init(int m, bool sP);
};

#endif