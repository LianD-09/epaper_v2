#ifndef __UTILS_H
#define __UTILS_H

#include <sstream>
#include <iostream>
#include <iomanip>
#include <vector>
#include <base64.h>
#include <SPIFFS.h>
#include <FS.h>

#define IMAGE_PATH "/input2"

typedef std::pair<std::string, std::string> json_pattern;

std::string uint8_to_hex_string(const uint8_t *v, const size_t s);
uint8_t *hex_string_to_uint8(std::string input);
size_t hex_string_to_number(std::string hex);
std::string create_json_string(std::vector<json_pattern> vector);
std::string base64_encode(const std::string &data);
/* binary_to_base64:
 *   Description:
 *     Converts a single byte from a binary value to the corresponding base64 character
 *   Parameters:
 *     v - Byte to convert
 *   Returns:
 *     ascii code of base64 character. If byte is >= 64, then there is not corresponding base64 character
 *     and 255 is returned
 */
unsigned char binary_to_base64(unsigned char v);

/* base64_to_binary:
 *   Description:
 *     Converts a single byte from a base64 character to the corresponding binary value
 *   Parameters:
 *     c - Base64 character (as ascii code)
 *   Returns:
 *     6-bit binary value
 */
unsigned char base64_to_binary(unsigned char c);

/* encode_base64_length:
 *   Description:
 *     Calculates length of base64 string needed for a given number of binary bytes
 *   Parameters:
 *     input_length - Amount of binary data in bytes
 *   Returns:
 *     Number of base64 characters needed to encode input_length bytes of binary data
 */
unsigned int encode_base64_length(unsigned int input_length);

/* decode_base64_length:
 *   Description:
 *     Calculates number of bytes of binary data in a base64 string
 *     Variant that does not use input_length no longer used within library, retained for API compatibility
 *   Parameters:
 *     input - Base64-encoded null-terminated string
 *     input_length (optional) - Number of bytes to read from input pointer
 *   Returns:
 *     Number of bytes of binary data in input
 */
unsigned int decode_base64_length(const unsigned char input[]);
unsigned int decode_base64_length(const unsigned char input[], unsigned int input_length);

/* encode_base64:
 *   Description:
 *     Converts an array of bytes to a base64 null-terminated string
 *   Parameters:
 *     input - Pointer to input data
 *     input_length - Number of bytes to read from input pointer
 *     output - Pointer to output string. Null terminator will be added automatically
 *   Returns:
 *     Length of encoded string in bytes (not including null terminator)
 */
unsigned int encode_base64(const unsigned char input[], unsigned int input_length, unsigned char output[]);

/* decode_base64:
 *   Description:
 *     Converts a base64 null-terminated string to an array of bytes
 *   Parameters:
 *     input - Pointer to input string
 *     input_length (optional) - Number of bytes to read from input pointer
 *     output - Pointer to output array
 *   Returns:
 *     Number of bytes in the decoded binary
 */
unsigned int decode_base64(const unsigned char input[], unsigned char output[]);
unsigned int decode_base64(const unsigned char input[], unsigned int input_length, unsigned char output[]);

void writeFile(fs::FS &fs, const char *path, const uint8_t *data, size_t length);
void readFile(fs::FS &fs, const char *path, uint8_t *data, size_t length);

#endif