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

size_t hex_string_to_number(std::string hex)
{
    size_t x;
    std::stringstream ss;
    ss << std::hex << hex;
    ss >> x;

    return x;
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

unsigned char binary_to_base64(unsigned char v)
{
    // Capital letters - 'A' is ascii 65 and base64 0
    if (v < 26)
        return v + 'A';

    // Lowercase letters - 'a' is ascii 97 and base64 26
    if (v < 52)
        return v + 71;

    // Digits - '0' is ascii 48 and base64 52
    if (v < 62)
        return v - 4;

#ifdef BASE64_URL
    // '-' is ascii 45 and base64 62
    if (v == 62)
        return '-';
#else
    // '+' is ascii 43 and base64 62
    if (v == 62)
        return '+';
#endif

#ifdef BASE64_URL
    // '_' is ascii 95 and base64 62
    if (v == 63)
        return '_';
#else
    // '/' is ascii 47 and base64 63
    if (v == 63)
        return '/';
#endif

    return 64;
}

unsigned char base64_to_binary(unsigned char c)
{
    // Capital letters - 'A' is ascii 65 and base64 0
    if ('A' <= c && c <= 'Z')
        return c - 'A';

    // Lowercase letters - 'a' is ascii 97 and base64 26
    if ('a' <= c && c <= 'z')
        return c - 71;

    // Digits - '0' is ascii 48 and base64 52
    if ('0' <= c && c <= '9')
        return c + 4;

#ifdef BASE64_URL
    // '-' is ascii 45 and base64 62
    if (c == '-')
        return 62;
#else
    // '+' is ascii 43 and base64 62
    if (c == '+')
        return 62;
#endif

#ifdef BASE64_URL
    // '_' is ascii 95 and base64 62
    if (c == '_')
        return 63;
#else
    // '/' is ascii 47 and base64 63
    if (c == '/')
        return 63;
#endif

    return 255;
}

unsigned int encode_base64_length(unsigned int input_length)
{
    return (input_length + 2) / 3 * 4;
}

unsigned int decode_base64_length(const unsigned char input[])
{
    return decode_base64_length(input, -1);
}

unsigned int decode_base64_length(const unsigned char input[], unsigned int input_length)
{
    const unsigned char *start = input;

    while (base64_to_binary(input[0]) < 64 && (unsigned int)(input - start) < input_length)
    {
        ++input;
    }

    input_length = (unsigned int)(input - start);
    return input_length / 4 * 3 + (input_length % 4 ? input_length % 4 - 1 : 0);
}

unsigned int encode_base64(const unsigned char input[], unsigned int input_length, unsigned char output[])
{
    unsigned int full_sets = input_length / 3;

    // While there are still full sets of 24 bits...
    for (unsigned int i = 0; i < full_sets; ++i)
    {
        output[0] = binary_to_base64(input[0] >> 2);
        output[1] = binary_to_base64((input[0] & 0x03) << 4 | input[1] >> 4);
        output[2] = binary_to_base64((input[1] & 0x0F) << 2 | input[2] >> 6);
        output[3] = binary_to_base64(input[2] & 0x3F);

        input += 3;
        output += 4;
    }

    switch (input_length % 3)
    {
    case 0:
        output[0] = '\0';
        break;
    case 1:
        output[0] = binary_to_base64(input[0] >> 2);
        output[1] = binary_to_base64((input[0] & 0x03) << 4);
        output[2] = '=';
        output[3] = '=';
        output[4] = '\0';
        break;
    case 2:
        output[0] = binary_to_base64(input[0] >> 2);
        output[1] = binary_to_base64((input[0] & 0x03) << 4 | input[1] >> 4);
        output[2] = binary_to_base64((input[1] & 0x0F) << 2);
        output[3] = '=';
        output[4] = '\0';
        break;
    }

    return encode_base64_length(input_length);
}

unsigned int decode_base64(const unsigned char input[], unsigned char output[])
{
    return decode_base64(input, -1, output);
}

unsigned int decode_base64(const unsigned char input[], unsigned int input_length, unsigned char output[])
{
    unsigned int output_length = decode_base64_length(input, input_length);

    // While there are still full sets of 24 bits...
    for (unsigned int i = 2; i < output_length; i += 3)
    {
        output[0] = base64_to_binary(input[0]) << 2 | base64_to_binary(input[1]) >> 4;
        output[1] = base64_to_binary(input[1]) << 4 | base64_to_binary(input[2]) >> 2;
        output[2] = base64_to_binary(input[2]) << 6 | base64_to_binary(input[3]);

        input += 4;
        output += 3;
    }

    switch (output_length % 3)
    {
    case 1:
        output[0] = base64_to_binary(input[0]) << 2 | base64_to_binary(input[1]) >> 4;
        break;
    case 2:
        output[0] = base64_to_binary(input[0]) << 2 | base64_to_binary(input[1]) >> 4;
        output[1] = base64_to_binary(input[1]) << 4 | base64_to_binary(input[2]) >> 2;
        break;
    }

    return output_length;
}