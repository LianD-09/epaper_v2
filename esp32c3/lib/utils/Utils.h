#ifndef __UTILS_H
#define __UTILS_H

#include <sstream>
#include <iostream>
#include <iomanip>
#include <vector>
#include <base64.h>
typedef std::pair<std::string, std::string> json_pattern;

std::string uint8_to_hex_string(const uint8_t *v, const size_t s);
uint8_t *convertToHexByte(std::string input);
std::string create_json_string(std::vector<json_pattern> vector);
std::string base64_encode(const std::string &data);

#endif