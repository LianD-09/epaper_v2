#ifndef __DISPLAY_H
#define __DISPLAY_H

#include <Preferences.h>
#include <DEV_Config.h>
#include <EPD_2in9_V2.h>
#include <Paint.h>
#include <Wire.h>
#include <cstdint>
#include <qrcode.h>
#include <fonts.h>

extern Preferences preferences;

// char16_t * utf8ToUtf16(const char *utf8, size_t &outLength);
bool compareStrings(const char *str1, const char *str2);

void displayWrite1(UBYTE *BlackImage);
void displayWrite2(UBYTE *BlackImage);
void displayWrite3(UBYTE *BlackImage);
void displayWrite4(UBYTE *BlackImage);
void displayWrite5(UBYTE *BlackImage);
void displayEmpty(UBYTE *BlackImage);
void displayQRText(UBYTE *BlackImage, const char *text, int mode);
void displayImage(UBYTE *BlackImage);
UWORD alignMono(const char *text, const mFONT *font, uint8_t percentage, bool horizontal = true);
UWORD alignSegoe(const char *text, const sFONT *font, uint8_t percentage, bool horizontal = true);

#endif /* __DISPLAY_H */