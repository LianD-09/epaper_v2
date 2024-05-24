#ifndef __UTILS_H
#define __UTILS_H

#include <sstream>
#include <iostream>
#include <iomanip>

std::string uint8_to_hex_string(const uint8_t *v, const size_t s);
uint8_t *convertToHexByte(std::string input);

#endif