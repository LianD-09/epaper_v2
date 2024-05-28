/******************************************************************************
 * | File      	:   GUI_Paint.c
 * | Author      :   Waveshare electronics
 * | Function    :	Achieve drawing: draw points, lines, boxes, circles and
 *                   their size, solid dotted line, solid rectangle hollow
 *                   rectangle, solid circle hollow circle.
 * | Info        :
 *   Achieve display characters: Display a single character, string, number
 *   Achieve time display: adaptive size display time minutes and seconds
 *----------------
 * |	This version:   V3.2
 * | Date        :   2020-07-23
 * | Info        :
 * -----------------------------------------------------------------------------
 * V3.2(2020-07-23):
 * 1. Change: Paint_SetScale(UBYTE scale)
 *			Add scale 7 for 5.65f e-Parper
 * 2. Change: Paint_SetPixel(UWORD Xpoint, UWORD Ypoint, UWORD Color)
 * 			Add the branch for scale 7
 * 3. Change: Paint_Clear(UWORD Color)
 *			Add the branch for scale 7
 *
 * V3.1(2019-10-10):
 * 1. Add gray level
 *   PAINT Add Scale
 * 2. Add void Paint_SetScale(UBYTE scale);
 *
 * V3.0(2019-04-18):
 * 1.Change:
 *    Paint_DrawPoint(..., DOT_STYLE DOT_STYLE)
 * => Paint_DrawPoint(..., DOT_STYLE Dot_Style)
 *    Paint_DrawLine(..., LINE_STYLE Line_Style, DOT_PIXEL Dot_Pixel)
 * => Paint_DrawLine(..., DOT_PIXEL Line_width, LINE_STYLE Line_Style)
 *    Paint_DrawRectangle(..., DRAW_FILL Filled, DOT_PIXEL Dot_Pixel)
 * => Paint_DrawRectangle(..., DOT_PIXEL Line_width, DRAW_FILL Draw_Fill)
 *    Paint_DrawCircle(..., DRAW_FILL Draw_Fill, DOT_PIXEL Dot_Pixel)
 * => Paint_DrawCircle(..., DOT_PIXEL Line_width, DRAW_FILL Draw_Filll)
 *
 * -----------------------------------------------------------------------------
 * V2.0(2018-11-15):
 * 1.add: Paint_NewImage()
 *    Create an image's properties
 * 2.add: Paint_SelectImage()
 *    Select the picture to be drawn
 * 3.add: Paint_SetRotate()
 *    Set the direction of the cache
 * 4.add: Paint_RotateImage()
 *    Can flip the picture, Support 0-360 degrees,
 *    but only 90.180.270 rotation is better
 * 4.add: Paint_SetMirroring()
 *    Can Mirroring the picture, horizontal, vertical, origin
 * 5.add: Paint_DrawString_custom()
 *    Can display Chinese(GB1312)
 *
 * -----------------------------------------------------------------------------
 * V1.0(2018-07-17):
 *   Create library
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documnetation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to  whom the Software is
 * furished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS OR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 ******************************************************************************/
#include <Paint.h>
#include <DEV_Config.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h> //memset()
#include <math.h>
#include <cwchar>

#include <stdio.h>

PAINT Paint;

int utf8ToUnicodePoint(const char *utf8)
{
    if (utf8 == NULL)
        return -1;

    const unsigned char *bytes = (const unsigned char *)utf8;
    int unicode = 0;

    if ((bytes[0] & 0x80) == 0x00)
    {
        // 1-byte UTF-8 (0xxxxxxx)
        unicode = bytes[0];
    }
    else if ((bytes[0] & 0xE0) == 0xC0)
    {
        // 2-byte UTF-8 (110xxxxx 10xxxxxx)
        unicode = ((bytes[0] & 0x1F) << 6) | (bytes[1] & 0x3F);
    }
    else if ((bytes[0] & 0xF0) == 0xE0)
    {
        // 3-byte UTF-8 (1110xxxx 10xxxxxx 10xxxxxx)
        unicode = ((bytes[0] & 0x0F) << 12) | ((bytes[1] & 0x3F) << 6) | (bytes[2] & 0x3F);
    }
    else if ((bytes[0] & 0xF8) == 0xF0)
    {
        // 4-byte UTF-8 (11110xxx 10xxxxxx 10xxxxxx 10xxxxxx)
        unicode = ((bytes[0] & 0x07) << 18) | ((bytes[1] & 0x3F) << 12) | ((bytes[2] & 0x3F) << 6) | (bytes[3] & 0x3F);
    }
    else
    {
        // Invalid UTF-8
        return -1;
    }

    return unicode;
}

/******************************************************************************
function: Create Image
parameter:
    image   :   Pointer to the image cache
    width   :   The width of the picture
    Height  :   The height of the picture
    Color   :   Whether the picture is inverted
******************************************************************************/
void Paint_NewImage(UBYTE *image, UWORD Width, UWORD Height, UWORD Rotate, UWORD Color)
{
    Paint.Image = NULL;
    Paint.Image = image;

    Paint.WidthMemory = Width;
    Paint.HeightMemory = Height;
    Paint.Color = Color;
    Paint.Scale = 2;
    Paint.WidthByte = (Width % 8 == 0) ? (Width / 8) : (Width / 8 + 1);
    Paint.HeightByte = Height;
    //    printf("WidthByte = %d, HeightByte = %d\r\n", Paint.WidthByte, Paint.HeightByte);
    //    printf(" EPD_WIDTH / 8 = %d\r\n",  122 / 8);

    Paint.Rotate = Rotate;
    Paint.Mirror = MIRROR_NONE;

    if (Rotate == ROTATE_0 || Rotate == ROTATE_180)
    {
        Paint.Width = Width;
        Paint.Height = Height;
    }
    else
    {
        Paint.Width = Height;
        Paint.Height = Width;
    }
}

/******************************************************************************
function: Select Image
parameter:
    image : Pointer to the image cache
******************************************************************************/
void Paint_SelectImage(UBYTE *image)
{
    Paint.Image = image;
}

/******************************************************************************
function: Select Image Rotate
parameter:
    Rotate : 0,90,180,270
******************************************************************************/
void Paint_SetRotate(UWORD Rotate)
{
    if (Rotate == ROTATE_0 || Rotate == ROTATE_90 || Rotate == ROTATE_180 || Rotate == ROTATE_270)
    {
        // Serial.print("Set image Rotate %d\r\n", Rotate);
        Paint.Rotate = Rotate;
    }
    else
    {
        Serial.print("rotate = 0, 90, 180, 270\r\n");
    }
}

/******************************************************************************
function:	Select Image mirror
parameter:
    mirror   :Not mirror,Horizontal mirror,Vertical mirror,Origin mirror
******************************************************************************/
void Paint_SetMirroring(UBYTE mirror)
{
    if (mirror == MIRROR_NONE || mirror == MIRROR_HORIZONTAL ||
        mirror == MIRROR_VERTICAL || mirror == MIRROR_ORIGIN)
    {
        // Serial.print("mirror image x:%s, y:%s\r\n",(mirror & 0x01)? "mirror":"none", ((mirror >> 1) & 0x01)? "mirror":"none");
        Paint.Mirror = mirror;
    }
    else
    {
        Serial.print("mirror should be MIRROR_NONE, MIRROR_HORIZONTAL, \
        MIRROR_VERTICAL or MIRROR_ORIGIN\r\n");
    }
}

void Paint_SetScale(UBYTE scale)
{
    if (scale == 2)
    {
        Paint.Scale = scale;
        Paint.WidthByte = (Paint.WidthMemory % 8 == 0) ? (Paint.WidthMemory / 8) : (Paint.WidthMemory / 8 + 1);
    }
    else if (scale == 4)
    {
        Paint.Scale = scale;
        Paint.WidthByte = (Paint.WidthMemory % 4 == 0) ? (Paint.WidthMemory / 4) : (Paint.WidthMemory / 4 + 1);
    }
    else if (scale == 7)
    { // Only applicable with 5in65 e-Paper
        Paint.Scale = 7;
        Paint.WidthByte = (Paint.WidthMemory % 2 == 0) ? (Paint.WidthMemory / 2) : (Paint.WidthMemory / 2 + 1);
    }
    else
    {
        Serial.print("Set Scale Input parameter error\r\n");
        Serial.print("Scale Only support: 2 4 7\r\n");
    }
}
/******************************************************************************
function: Draw Pixels
parameter:
    Xpoint : At point X
    Ypoint : At point Y
    Color  : Painted colors
******************************************************************************/
void Paint_SetPixel(UWORD Xpoint, UWORD Ypoint, UWORD Color)
{
    if (Xpoint > Paint.Width || Ypoint > Paint.Height)
    {
        Serial.print("Exceeding display boundaries\r\n");
        return;
    }
    UWORD X, Y;
    switch (Paint.Rotate)
    {
    case 0:
        X = Xpoint;
        Y = Ypoint;
        break;
    case 90:
        X = Paint.WidthMemory - Ypoint - 1;
        Y = Xpoint;
        break;
    case 180:
        X = Paint.WidthMemory - Xpoint - 1;
        Y = Paint.HeightMemory - Ypoint - 1;
        break;
    case 270:
        X = Ypoint;
        Y = Paint.HeightMemory - Xpoint - 1;
        break;
    default:
        return;
    }

    switch (Paint.Mirror)
    {
    case MIRROR_NONE:
        break;
    case MIRROR_HORIZONTAL:
        X = Paint.WidthMemory - X - 1;
        break;
    case MIRROR_VERTICAL:
        Y = Paint.HeightMemory - Y - 1;
        break;
    case MIRROR_ORIGIN:
        X = Paint.WidthMemory - X - 1;
        Y = Paint.HeightMemory - Y - 1;
        break;
    default:
        return;
    }

    if (X > Paint.WidthMemory || Y > Paint.HeightMemory)
    {
        Serial.print("Exceeding display boundaries\r\n");
        return;
    }

    if (Paint.Scale == 2)
    {
        UDOUBLE Addr = X / 8 + Y * Paint.WidthByte;
        UBYTE Rdata = Paint.Image[Addr];
        if (Color == BLACK)
            Paint.Image[Addr] = Rdata & ~(0x80 >> (X % 8));
        else
            Paint.Image[Addr] = Rdata | (0x80 >> (X % 8));
    }
    else if (Paint.Scale == 4)
    {
        UDOUBLE Addr = X / 4 + Y * Paint.WidthByte;
        Color = Color % 4; // Guaranteed color scale is 4  --- 0~3
        UBYTE Rdata = Paint.Image[Addr];

        Rdata = Rdata & (~(0xC0 >> ((X % 4) * 2)));
        Paint.Image[Addr] = Rdata | ((Color << 6) >> ((X % 4) * 2));
    }
    else if (Paint.Scale == 7)
    {
        UWORD Width = Paint.WidthMemory * 3 % 8 == 0 ? Paint.WidthMemory * 3 / 8 : Paint.WidthMemory * 3 / 8 + 1;
        UDOUBLE Addr = (Xpoint * 3) / 8 + Ypoint * Width;
        UBYTE shift, Rdata, Rdata2;
        shift = (Xpoint + Ypoint * Paint.HeightMemory) % 8;

        switch (shift)
        {
        case 0:
            Rdata = Paint.Image[Addr] & 0x1f;
            Rdata = Rdata | ((Color << 5) & 0xe0);
            Paint.Image[Addr] = Rdata;
            break;
        case 1:
            Rdata = Paint.Image[Addr] & 0xe3;
            Rdata = Rdata | ((Color << 2) & 0x1c);
            Paint.Image[Addr] = Rdata;
            break;
        case 2:
            Rdata = Paint.Image[Addr] & 0xfc;
            Rdata2 = Paint.Image[Addr + 1] & 0x7f;
            Rdata = Rdata | ((Color >> 1) & 0x03);
            Rdata2 = Rdata2 | ((Color << 7) & 0x80);
            Paint.Image[Addr] = Rdata;
            Paint.Image[Addr + 1] = Rdata2;
            break;
        case 3:
            Rdata = Paint.Image[Addr] & 0x8f;
            Rdata = Rdata | ((Color << 4) & 0x70);
            Paint.Image[Addr] = Rdata;
            break;
        case 4:
            Rdata = Paint.Image[Addr] & 0xf1;
            Rdata = Rdata | ((Color << 1) & 0x0e);
            Paint.Image[Addr] = Rdata;
            break;
        case 5:
            Rdata = Paint.Image[Addr] & 0xfe;
            Rdata2 = Paint.Image[Addr + 1] & 0x3f;
            Rdata = Rdata | ((Color >> 2) & 0x01);
            Rdata2 = Rdata2 | ((Color << 6) & 0xc0);
            Paint.Image[Addr] = Rdata;
            Paint.Image[Addr + 1] = Rdata2;
            break;
        case 6:
            Rdata = Paint.Image[Addr] & 0xc7;
            Rdata = Rdata | ((Color << 3) & 0x38);
            Paint.Image[Addr] = Rdata;
            break;
        case 7:
            Rdata = Paint.Image[Addr] & 0xf8;
            Rdata = Rdata | (Color & 0x07);
            Paint.Image[Addr] = Rdata;
            break;
        }
    }
}

/******************************************************************************
function: Clear the color of the picture
parameter:
    Color : Painted colors
******************************************************************************/
void Paint_Clear(UWORD Color)
{
    if (Paint.Scale == 2 || Paint.Scale == 4)
    {
        for (UWORD Y = 0; Y < Paint.HeightByte; Y++)
        {
            for (UWORD X = 0; X < Paint.WidthByte; X++)
            { // 8 pixel =  1 byte
                UDOUBLE Addr = X + Y * Paint.WidthByte;
                Paint.Image[Addr] = Color;
            }
        }
    }
    if (Paint.Scale == 7)
    {
        Color = (UBYTE)Color;
        UWORD Width = (Paint.WidthMemory * 3 % 8 == 0) ? (Paint.WidthMemory * 3 / 8) : (Paint.WidthMemory * 3 / 8 + 1);
        for (UWORD Y = 0; Y < Paint.HeightByte; Y++)
        {
            for (UWORD X = 0; X < Width; X++)
            {
                UDOUBLE Addr = X + Y * Width;
                if ((X + Y * Width) % 3 == 0)
                    Paint.Image[Addr] = ((Color << 5) | (Color << 2) | (Color >> 1));
                else if ((X + Y * Width) % 3 == 1)
                    Paint.Image[Addr] = ((Color << 7) | (Color << 4) | (Color << 1) | (Color >> 2));
                else if ((X + Y * Width) % 3 == 2)
                    Paint.Image[Addr] = ((Color << 6) | (Color << 3) | Color);
            }
        }
    }
}

/******************************************************************************
function: Clear the color of a window
parameter:
    Xstart : x starting point
    Ystart : Y starting point
    Xend   : x end point
    Yend   : y end point
    Color  : Painted colors
******************************************************************************/
void Paint_ClearWindows(UWORD Xstart, UWORD Ystart, UWORD Xend, UWORD Yend, UWORD Color)
{
    UWORD X, Y;
    for (Y = Ystart; Y < Yend; Y++)
    {
        for (X = Xstart; X < Xend; X++)
        { // 8 pixel =  1 byte
            Paint_SetPixel(X, Y, Color);
        }
    }
}

/******************************************************************************
function: Draw Point(Xpoint, Ypoint) Fill the color
parameter:
    Xpoint		: The Xpoint coordinate of the point
    Ypoint		: The Ypoint coordinate of the point
    Color		: Painted color
    Dot_Pixel	: point size
    Dot_Style	: point Style
******************************************************************************/
void Paint_DrawPoint(UWORD Xpoint, UWORD Ypoint, UWORD Color,
                     DOT_PIXEL Dot_Pixel, DOT_STYLE Dot_Style)
{
    if (Xpoint > Paint.Width || Ypoint > Paint.Height)
    {
        Serial.print("Paint_DrawPoint Input exceeds the normal display range\r\n");
        return;
    }

    int16_t XDir_Num, YDir_Num;
    if (Dot_Style == DOT_FILL_AROUND)
    {
        for (XDir_Num = 0; XDir_Num < 2 * Dot_Pixel - 1; XDir_Num++)
        {
            for (YDir_Num = 0; YDir_Num < 2 * Dot_Pixel - 1; YDir_Num++)
            {
                if (Xpoint + XDir_Num - Dot_Pixel < 0 || Ypoint + YDir_Num - Dot_Pixel < 0)
                    break;
                // printf("x = %d, y = %d\r\n", Xpoint + XDir_Num - Dot_Pixel, Ypoint + YDir_Num - Dot_Pixel);
                Paint_SetPixel(Xpoint + XDir_Num - Dot_Pixel, Ypoint + YDir_Num - Dot_Pixel, Color);
            }
        }
    }
    else
    {
        for (XDir_Num = 0; XDir_Num < Dot_Pixel; XDir_Num++)
        {
            for (YDir_Num = 0; YDir_Num < Dot_Pixel; YDir_Num++)
            {
                Paint_SetPixel(Xpoint + XDir_Num - 1, Ypoint + YDir_Num - 1, Color);
            }
        }
    }
}

/******************************************************************************
function: Draw a line of arbitrary slope
parameter:
    Xstart ：Starting Xpoint point coordinates
    Ystart ：Starting Xpoint point coordinates
    Xend   ：End point Xpoint coordinate
    Yend   ：End point Ypoint coordinate
    Color  ：The color of the line segment
    Line_width : Line width
    Line_Style: Solid and dotted lines
******************************************************************************/
void Paint_DrawLine(UWORD Xstart, UWORD Ystart, UWORD Xend, UWORD Yend,
                    UWORD Color, DOT_PIXEL Line_width, LINE_STYLE Line_Style)
{
    if (Xstart > Paint.Width || Ystart > Paint.Height ||
        Xend > Paint.Width || Yend > Paint.Height)
    {
        Serial.print("Paint_DrawLine Input exceeds the normal display range\r\n");
        return;
    }

    UWORD Xpoint = Xstart;
    UWORD Ypoint = Ystart;
    int dx = (int)Xend - (int)Xstart >= 0 ? Xend - Xstart : Xstart - Xend;
    int dy = (int)Yend - (int)Ystart <= 0 ? Yend - Ystart : Ystart - Yend;

    // Increment direction, 1 is positive, -1 is counter;
    int XAddway = Xstart < Xend ? 1 : -1;
    int YAddway = Ystart < Yend ? 1 : -1;

    // Cumulative error
    int Esp = dx + dy;
    char Dotted_Len = 0;

    for (;;)
    {
        Dotted_Len++;
        // Painted dotted line, 2 point is really virtual
        if (Line_Style == LINE_STYLE_DOTTED && Dotted_Len % 3 == 0)
        {
            // Serial.print("LINE_DOTTED\r\n");
            Paint_DrawPoint(Xpoint, Ypoint, IMAGE_BACKGROUND, Line_width, DOT_STYLE_DFT);
            Dotted_Len = 0;
        }
        else
        {
            Paint_DrawPoint(Xpoint, Ypoint, Color, Line_width, DOT_STYLE_DFT);
        }
        if (2 * Esp >= dy)
        {
            if (Xpoint == Xend)
                break;
            Esp += dy;
            Xpoint += XAddway;
        }
        if (2 * Esp <= dx)
        {
            if (Ypoint == Yend)
                break;
            Esp += dx;
            Ypoint += YAddway;
        }
    }
}

/******************************************************************************
function: Draw a rectangle
parameter:
    Xstart ：Rectangular  Starting Xpoint point coordinates
    Ystart ：Rectangular  Starting Xpoint point coordinates
    Xend   ：Rectangular  End point Xpoint coordinate
    Yend   ：Rectangular  End point Ypoint coordinate
    Color  ：The color of the Rectangular segment
    Line_width: Line width
    Draw_Fill : Whether to fill the inside of the rectangle
******************************************************************************/
void Paint_DrawRectangle(UWORD Xstart, UWORD Ystart, UWORD Xend, UWORD Yend,
                         UWORD Color, DOT_PIXEL Line_width, DRAW_FILL Draw_Fill)
{
    if (Xstart > Paint.Width || Ystart > Paint.Height ||
        Xend > Paint.Width || Yend > Paint.Height)
    {
        Serial.print("Input exceeds the normal display range\r\n");
        return;
    }

    if (Draw_Fill)
    {
        UWORD Ypoint;
        for (Ypoint = Ystart; Ypoint < Yend; Ypoint++)
        {
            Paint_DrawLine(Xstart, Ypoint, Xend, Ypoint, Color, Line_width, LINE_STYLE_SOLID);
        }
    }
    else
    {
        Paint_DrawLine(Xstart, Ystart, Xend, Ystart, Color, Line_width, LINE_STYLE_SOLID);
        Paint_DrawLine(Xstart, Ystart, Xstart, Yend, Color, Line_width, LINE_STYLE_SOLID);
        Paint_DrawLine(Xend, Yend, Xend, Ystart, Color, Line_width, LINE_STYLE_SOLID);
        Paint_DrawLine(Xend, Yend, Xstart, Yend, Color, Line_width, LINE_STYLE_SOLID);
    }
}

/******************************************************************************
function: Use the 8-point method to draw a circle of the
            specified size at the specified position->
parameter:
    X_Center  ：Center X coordinate
    Y_Center  ：Center Y coordinate
    Radius    ：circle Radius
    Color     ：The color of the ：circle segment
    Line_width: Line width
    Draw_Fill : Whether to fill the inside of the Circle
******************************************************************************/
void Paint_DrawCircle(UWORD X_Center, UWORD Y_Center, UWORD Radius,
                      UWORD Color, DOT_PIXEL Line_width, DRAW_FILL Draw_Fill)
{
    if (X_Center > Paint.Width || Y_Center >= Paint.Height)
    {
        Serial.print("Paint_DrawCircle Input exceeds the normal display range\r\n");
        return;
    }

    // Draw a circle from(0, R) as a starting point
    int16_t XCurrent, YCurrent;
    XCurrent = 0;
    YCurrent = Radius;

    // Cumulative error,judge the next point of the logo
    int16_t Esp = 3 - (Radius << 1);

    int16_t sCountY;
    if (Draw_Fill == DRAW_FILL_FULL)
    {
        while (XCurrent <= YCurrent)
        { // Realistic circles
            for (sCountY = XCurrent; sCountY <= YCurrent; sCountY++)
            {
                Paint_DrawPoint(X_Center + XCurrent, Y_Center + sCountY, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT); // 1
                Paint_DrawPoint(X_Center - XCurrent, Y_Center + sCountY, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT); // 2
                Paint_DrawPoint(X_Center - sCountY, Y_Center + XCurrent, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT); // 3
                Paint_DrawPoint(X_Center - sCountY, Y_Center - XCurrent, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT); // 4
                Paint_DrawPoint(X_Center - XCurrent, Y_Center - sCountY, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT); // 5
                Paint_DrawPoint(X_Center + XCurrent, Y_Center - sCountY, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT); // 6
                Paint_DrawPoint(X_Center + sCountY, Y_Center - XCurrent, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT); // 7
                Paint_DrawPoint(X_Center + sCountY, Y_Center + XCurrent, Color, DOT_PIXEL_DFT, DOT_STYLE_DFT);
            }
            if (Esp < 0)
                Esp += 4 * XCurrent + 6;
            else
            {
                Esp += 10 + 4 * (XCurrent - YCurrent);
                YCurrent--;
            }
            XCurrent++;
        }
    }
    else
    { // Draw a hollow circle
        while (XCurrent <= YCurrent)
        {
            Paint_DrawPoint(X_Center + XCurrent, Y_Center + YCurrent, Color, Line_width, DOT_STYLE_DFT); // 1
            Paint_DrawPoint(X_Center - XCurrent, Y_Center + YCurrent, Color, Line_width, DOT_STYLE_DFT); // 2
            Paint_DrawPoint(X_Center - YCurrent, Y_Center + XCurrent, Color, Line_width, DOT_STYLE_DFT); // 3
            Paint_DrawPoint(X_Center - YCurrent, Y_Center - XCurrent, Color, Line_width, DOT_STYLE_DFT); // 4
            Paint_DrawPoint(X_Center - XCurrent, Y_Center - YCurrent, Color, Line_width, DOT_STYLE_DFT); // 5
            Paint_DrawPoint(X_Center + XCurrent, Y_Center - YCurrent, Color, Line_width, DOT_STYLE_DFT); // 6
            Paint_DrawPoint(X_Center + YCurrent, Y_Center - XCurrent, Color, Line_width, DOT_STYLE_DFT); // 7
            Paint_DrawPoint(X_Center + YCurrent, Y_Center + XCurrent, Color, Line_width, DOT_STYLE_DFT); // 0

            if (Esp < 0)
                Esp += 4 * XCurrent + 6;
            else
            {
                Esp += 10 + 4 * (XCurrent - YCurrent);
                YCurrent--;
            }
            XCurrent++;
        }
    }
}

/******************************************************************************
function: Show English characters
parameter:
    Xpoint           ：X coordinate
    Ypoint           ：Y coordinate
    Acsii_Char       ：To display the English characters
    Font             ：A structure pointer that displays a character size
    Color_Foreground : Select the foreground color
    Color_Background : Select the background color
******************************************************************************/
void Paint_DrawChar(UWORD Xpoint, UWORD Ypoint, const char Acsii_Char,
                    const mFONT *Font, UWORD Color_Foreground, UWORD Color_Background)
{
    UWORD Page, Column;

    if (Xpoint > Paint.Width || Ypoint > Paint.Height)
    {
        Serial.print("Paint_DrawChar Input exceeds the normal display range\r\n");
        return;
    }

    uint32_t Char_Offset = (Acsii_Char - ' ') * Font->Height * (Font->Width / 8 + (Font->Width % 8 ? 1 : 0));
    const unsigned char *ptr = &Font->table[Char_Offset];

    for (Page = 0; Page < Font->Height; Page++)
    {
        for (Column = 0; Column < Font->Width; Column++)
        {

            // To determine whether the font background color and screen background color is consistent
            if (FONT_BACKGROUND == Color_Background)
            { // this process is to speed up the scan
                if (*ptr & (0x80 >> (Column % 8)))
                    Paint_SetPixel(Xpoint + Column, Ypoint + Page, Color_Foreground);
                // Paint_DrawPoint(Xpoint + Column, Ypoint + Page, Color_Foreground, DOT_PIXEL_DFT, DOT_STYLE_DFT);
            }
            else
            {
                if (*ptr & (0x80 >> (Column % 8)))
                {
                    Paint_SetPixel(Xpoint + Column, Ypoint + Page, Color_Foreground);
                    // Paint_DrawPoint(Xpoint + Column, Ypoint + Page, Color_Foreground, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                }
                else
                {
                    Paint_SetPixel(Xpoint + Column, Ypoint + Page, Color_Background);
                    // Paint_DrawPoint(Xpoint + Column, Ypoint + Page, Color_Background, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                }
            }
            // One pixel is 8 bits
            if (Column % 8 == 7)
                ptr++;
        } // Write a line
        if (Font->Width % 8 != 0)
            ptr++;
    } // Write all
}

/******************************************************************************
function:	Display the string
parameter:
    Xstart           ：X coordinate
    Ystart           ：Y coordinate
    pString          ：The first address of the English string to be displayed
    Font             ：A structure pointer that displays a character size
    Color_Foreground : Select the foreground color
    Color_Background : Select the background color
******************************************************************************/
void Paint_DrawString(UWORD Xstart, UWORD Ystart, const char *pString,
                      const mFONT *Font, UWORD Color_Foreground, UWORD Color_Background)
{
    UWORD Xpoint = Xstart;
    UWORD Ypoint = Ystart;
    Serial.println(Font->Width);
    Serial.print(Font->Height);

    if (Xstart > Paint.Width || Ystart > Paint.Height)
    {
        Serial.print("Paint_DrawString Input exceeds the normal display range\r\n");
        return;
    }

    while (*pString != '\0')
    {
        // if X direction filled , reposition to(Xstart,Ypoint),Ypoint is Y direction plus the Height of the character
        if ((Xpoint + Font->Width) > Paint.Width)
        {
            Xpoint = Xstart;
            Ypoint += Font->Height;
        }

        // If the Y direction is full, reposition to(Xstart, Ystart)
        if ((Ypoint + Font->Height) > Paint.Height)
        {
            Xpoint = Xstart;
            Ypoint = Ystart;
        }
        Paint_DrawChar(Xpoint, Ypoint, *pString, Font, Color_Foreground, Color_Background);

        // The next character of the address
        pString++;

        // The next word of the abscissa increases the font of the broadband
        Xpoint += Font->Width;
    }
}

void Paint_DrawString_custom(UWORD Xstart, UWORD Ystart, const char16_t *pString, cFONT *font,
                             UWORD Color_Foreground, UWORD Color_Background)
{
    const char16_t *p_text = pString;
    int x = Xstart, y = Ystart;
    int i, j, Num;

    /* Send the string character by character on EPD */
    while (*p_text != 0)
    {
        uint8_t width;
        for (Num = 0; Num < font->size; Num++)
        {
            if (*p_text == font->table[Num].index[0])
            {
                const char *ptr = &font->table[Num].matrix[0];
                width = font->table[Num].width;

                for (j = 0; j < font->Height; j++)
                {
                    for (i = 0; i < width; i++)
                    {
                        if (FONT_BACKGROUND == Color_Background)
                        { // this process is to speed up the scan
                            if (*ptr & (0x80 >> (i % 8)))
                            {
                                Paint_SetPixel(x + i, y + j, Color_Foreground);
                                // Paint_DrawPoint(x + i, y + j, Color_Foreground, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                            }
                        }
                        else
                        {
                            if (*ptr & (0x80 >> (i % 8)))
                            {
                                Paint_SetPixel(x + i, y + j, Color_Foreground);
                                // Paint_DrawPoint(x + i, y + j, Color_Foreground, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                            }
                            else
                            {
                                Paint_SetPixel(x + i, y + j, Color_Background);
                                // Paint_DrawPoint(x + i, y + j, Color_Background, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                            }
                        }
                        if (i % 8 == 7)
                        {
                            ptr++;
                        }
                    }
                    if (width % 8 != 0)
                    {
                        ptr++;
                    }
                }
                break;
            }
        }
        /* Point on the next character */
        p_text += 1;
        x += width + 2;
    }
}

void Paint_DrawString_segment(UWORD Xstart, UWORD Ystart, const char *pString, const sFONT *font,
                              UWORD Color_Foreground, UWORD Color_Background)
{
    const char *p_text = pString;
    int x = Xstart, y = Ystart;
    int i, j, Num;

    /* Send the string character by character on EPD */
    while (*p_text != 0)
    {
        int unicodePoint = utf8ToUnicodePoint(p_text);
        const FT_MAP *data = NULL;
        if (unicodePoint >= 32 && unicodePoint <= 107)
        { // Threshold for Segment 1: ASCII range
            data = font->binarySearchInSegment(unicodePoint, font->ASCII_table, 76);
        }
        else if (unicodePoint <= 7852)
        { // Threshold for Segment 2: ASCII range
            data = font->binarySearchInSegment(unicodePoint, font->vn_table, 76);
        }
        else if (unicodePoint <= 7929)
        { // Threshold for Segment 3: ASCII range
            data = font->binarySearchInSegment(unicodePoint, font->VN_table, 77);
        }

        uint8_t width;

        if (data != NULL)
        {
            // Serial.print(unicodePoint);
            // Serial.print(": (");
            // Serial.print(data->width);
            // Serial.print(", ");
            // Serial.print(data->index);
            // Serial.println(")");
            width = data->width;
            int index = data->index;

            const char *ptr = &font->table[index];
            for (j = 0; j < font->Height; j++)
            {
                for (i = 0; i < width; i++)
                {
                    if (FONT_BACKGROUND == Color_Background)
                    { // this process is to speed up the scan
                        if (*ptr & (0x80 >> (i % 8)))
                        {
                            Paint_SetPixel(x + i, y + j, Color_Foreground);
                            // Paint_DrawPoint(x + i, y + j, Color_Foreground, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                        }
                    }
                    else
                    {
                        if (*ptr & (0x80 >> (i % 8)))
                        {
                            Paint_SetPixel(x + i, y + j, Color_Foreground);
                            // Paint_DrawPoint(x + i, y + j, Color_Foreground, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                        }
                        else
                        {
                            Paint_SetPixel(x + i, y + j, Color_Background);
                            // Paint_DrawPoint(x + i, y + j, Color_Background, DOT_PIXEL_DFT, DOT_STYLE_DFT);
                        }
                    }
                    if (i % 8 == 7)
                    {
                        ptr++;
                    }
                }
                if (width % 8 != 0)
                {
                    ptr++;
                }
            }

            x += width + 2;
        }

        /* Point on the next character */
        p_text += 1;
    }
}

/******************************************************************************
function:	Display time
parameter:
    Xstart           ：X coordinate
    Ystart           : Y coordinate
    pTime            : Time-related structures
    Font             ：A structure pointer that displays a character size
    Color_Foreground : Select the foreground color
    Color_Background : Select the background color
******************************************************************************/
void Paint_DrawTime(UWORD Xstart, UWORD Ystart, PAINT_TIME *pTime, const mFONT *Font,
                    UWORD Color_Foreground, UWORD Color_Background)
{
    uint8_t value[10] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};

    UWORD Dx = Font->Width;

    // Write data into the cache
    Paint_DrawChar(Xstart, Ystart, value[pTime->Hour / 10], Font, Color_Background, Color_Foreground);
    Paint_DrawChar(Xstart + Dx, Ystart, value[pTime->Hour % 10], Font, Color_Background, Color_Foreground);
    Paint_DrawChar(Xstart + Dx + Dx / 4 + Dx / 2, Ystart, ':', Font, Color_Background, Color_Foreground);
    Paint_DrawChar(Xstart + Dx * 2 + Dx / 2, Ystart, value[pTime->Min / 10], Font, Color_Background, Color_Foreground);
    Paint_DrawChar(Xstart + Dx * 3 + Dx / 2, Ystart, value[pTime->Min % 10], Font, Color_Background, Color_Foreground);
    Paint_DrawChar(Xstart + Dx * 4 + Dx / 2 - Dx / 4, Ystart, ':', Font, Color_Background, Color_Foreground);
    Paint_DrawChar(Xstart + Dx * 5, Ystart, value[pTime->Sec / 10], Font, Color_Background, Color_Foreground);
    Paint_DrawChar(Xstart + Dx * 6, Ystart, value[pTime->Sec % 10], Font, Color_Background, Color_Foreground);
}

/******************************************************************************
function:	Display monochrome bitmap
parameter:
    image_buffer ：A picture data converted to a bitmap
info:
    Use a computer to convert the image into a corresponding array,
    and then embed the array directly into Imagedata.cpp as a .c file.
******************************************************************************/
void Paint_DrawBitMap(const unsigned char *image_buffer)
{
    UWORD x, y;
    UDOUBLE Addr = 0;

    for (y = 0; y < Paint.HeightByte; y++)
    {
        for (x = 0; x < Paint.WidthByte; x++)
        { // 8 pixel =  1 byte
            Addr = x + y * Paint.WidthByte;
            Paint.Image[Addr] = (unsigned char)image_buffer[Addr];
        }
    }
}

/******************************************************************************
function:	Display image
parameter:
    image            ：Image start address
    xStart           : X starting coordinates
    yStart           : Y starting coordinates
    xEnd             ：Image width
    yEnd             : Image height
******************************************************************************/
void Paint_DrawImage(const unsigned char *image_buffer, UWORD xStart, UWORD yStart, UWORD W_Image, UWORD H_Image)
{
    UWORD x, y;
    UWORD w_byte = (W_Image % 8) ? (W_Image / 8) + 1 : W_Image / 8;
    UDOUBLE Addr = 0;
    UDOUBLE pAddr = 0;
    for (y = 0; y < H_Image; y++)
        for (x = 0; x < w_byte; x++)
        {
            { // 8 pixel =  1 byte
                Addr = x + y * w_byte;
                pAddr = x + (xStart / 8) + ((y + yStart) * Paint.WidthByte);
                Paint.Image[pAddr] = (unsigned char)image_buffer[Addr];
            }
        }
}
