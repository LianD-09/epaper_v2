#include <Utils.h>

base64 base64Instance;
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

// Json string from vector
std::string create_json_string(std::vector<std::pair<std::string, std::string>> vector)
{
    std::string res;
    int length = vector.size();

    res += '{';

    for (int i = 0; i < length; i++)
    {
        // key
        res += '\"';
        res += vector[i].first;
        res += '\"';
        // :
        res += ':';
        // value
        res += '\"';
        res += vector[i].second;
        res += '\"';

        // add ',' if not last element
        if (i < length - 1)
        {
            res += ',';
        }
    }

    res += '}';
    return res;
}

std::string base64_encode(const std::string &data)
{
    String str_data = String(data.c_str());
    String encoded_data = base64Instance.encode(str_data);
    return encoded_data.c_str();
}