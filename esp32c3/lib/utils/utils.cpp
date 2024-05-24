#include <Utils.h>

// Convert uint8_t array to hex string
std::string uint8_to_hex_string(const uint8_t *v, const size_t s)
{
    std::stringstream ss;

    ss << std::hex << std::setfill('0');

    for (int i = 0; i < s; i++)
    {
        ss << std::hex << std::setw(2) << static_cast<int>(v[i]);
    }

    return ss.str();
}

// Convert hex string to uint8 array
uint8_t *hex_string_to_uint8(const std::string hex)
{
    size_t out_size = hex.length() / 2;

    uint8_t *bytes = new uint8_t[out_size];

    for (size_t i = 0; i < out_size; i++)
    {
        std::string byteString = hex.substr(2 * i, 2);
        // Convert two character in string to uint8_t
        bytes[i] = static_cast<uint8_t>(std::stoul(byteString, nullptr, 16));
    }

    return bytes;
}
