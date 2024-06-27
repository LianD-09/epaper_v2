#ifndef __MQTT // RabbitMQ
#define __MQTT

#include <WiFi.h>
#include <Wire.h>
#include <Arduino.h>
#include <DEV_Config.h>
#include <siot_core_lib.h>
#include <Display.h>
#include <ArduinoMqttClient.h>
#include <cstdint>
#include <ota.h>
#include <Utils.h>

// #include <Preferences.h>

// Replace the next variables with your SSID/Password combination

#define SSID "Do Ngoc"
#define PASS "12346789"
#define MQTT_BROKER "epaper.toolhub.app"
#define MQTT_PORT 1883
#define MQTT_USERNAME "linhda"
#define MQTT_PASSWORD "20194314"
/* #define CA "-----BEGIN CERTIFICATE----- \
MIIFSzCCAzOgAwIBAgIUIf99ZMGmgxa1e6paqCDZ5R3O0KswDQYJKoZIhvcNAQEL\
BQAwLTEZMBcGA1UECgwQQXJ0c2FraCBWZW50dXJlczEQMA4GA1UEAwwHUm9vdCBD\
QTAeFw0yNDAxMDcxNjUyMzZaFw00NDAxMDIxNjUyMzZaMC0xGTAXBgNVBAoMEEFy\
dHNha2ggVmVudHVyZXMxEDAOBgNVBAMMB1Jvb3QgQ0EwggIiMA0GCSqGSIb3DQEB\
AQUAA4ICDwAwggIKAoICAQDAUQUeZm4tHsLCl1fsHg9A06WcRt9hm/XeHZqN9ikS\
2YOB/jCbjk/nQquuSKlPA6SU7VJaW8rbNKzibU+GtcUlyeX1kQrpwWbVPhjSUoU0\
vwM9eZYpdMjw3nMZl8l9XWCIWNi/2tao5rQ/h/a6Plzk5EGXZzewfh3YheelWM5x\
39yY1kn+TRtx+ewn883RdRDSod+ggbPG+f140QUXXGHKqkbtnjlGn3w86NLoUYIf\
S4Nct+MnFVE1KjyuP6t6wKkkCklSlaQCUcIBnOyQU6PA6DaUAmLykfP32C5aXwuC\
pordpm13A3sdwQmfeMxqRroAbNMesRhWuEZ3s/lCY9GlsO4TB4FLYJe3vx2c8J/o\
Ol15qxiyv2S9B3RQ2CwN/9cnsc9NNJ9x9Z+yNCaVxWdJ5P2KpCSAQNzR3HaEq9W2\
NKp87c42/QCTX+ZltrP6BbAWME63Qktm4Pv4AucPQBNsIeEo5mhvIJtTiyYmBAhn\
2/CgWHlHAfnChiHLqbdLJ9PkhHP6kZEvYGapDWEEs5mfUcxMxHAeCNE5ynQ//YDd\
JLOdxT6oO59rqYNVez3js9jgG/ALNH0rSkrD96lt4WFGYK48eoeeQSaJqNUxNvzF\
/0ek2A3LM5481oI5z8Pmd2ngFWIWqYBwirlNU2FZYz8MzfzhP6MtC3Z4t6S8fsAo\
4QIDAQABo2MwYTAdBgNVHQ4EFgQUVbWc9mpCc4JU958VicBAdeEJkLgwHwYDVR0j\
BBgwFoAUVbWc9mpCc4JU958VicBAdeEJkLgwDwYDVR0TAQH/BAUwAwEB/zAOBgNV\
HQ8BAf8EBAMCAQYwDQYJKoZIhvcNAQELBQADggIBAHkXOiUBsDcu+emLfFhPz/JA\
2N6UIXDF0LRwTkXDcHDPOCxjCibx+Klt2eq76+On8wmn2NXOREQniovLxzqyA7yg\
O80wR/Ea89zHeTuc0THlgvzes6Yas4/+l5p2Im126gGxGIVOiY0UybygV890jZ+7\
FaGbzMdcojcXdXZXvBfTWEau3/tz/VcP5H8UOh0YjGN77+briDt8gt7OjkDwFhgD\
2Uk9EORGccvOIVBjb+9rzz+ZlXr9bPLhTMnbMqUVqpxHgag1tMmFxxahBoiESxZ2\
QN6i6sQ8YUmhl9Y9mxVp92zv/Z5fail7PF28C4kz1EA343aL9TodAYqfmF/jR8BH\
2EgzRnCb0Q+tvzC5lxopxt34No8GZ/MEt3Y8f7ArTJkMPx4Vy7LsKCkGP84MALoR\
lFVDqTIGmvi0Io0wP/rUV7ll/ZIY8gpgBv/j87vRU/VgKXQVT6cEzmkNoFbmlaPt\
dahjWz10GzpvpcBIdDSox3Tc/t+SvIReITtw+j3dbwHXXwn7ntJ5gpkPTiNY9jWM\
qe0N24Wo5jhP1+9d+5xp7BcJ56diSCAyn6uv5R0E+Md1l2fvmAErKWrtLd8dhyDk\
6O1vLQgwOKuWfe4vXL0wyioACIvEfKeBWBn2lQtG4MI2chbrpJlffOOBlFeqL/VP\
HUeN7nItRYxjYRxStnII\
-----END CERTIFICATE-----\
-----BEGIN CERTIFICATE-----\
MIIFRDCCAyygAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwLTEZMBcGA1UECgwQQXJ0\
c2FraCBWZW50dXJlczEQMA4GA1UEAwwHUm9vdCBDQTAeFw0yNDAxMDcxNzAwMzNa\
Fw0zNDAxMDQxNzAwMzNaMDUxGTAXBgNVBAoMEEFydHNha2ggVmVudHVyZXMxGDAW\
BgNVBAMMD0ludGVybWVkaWF0ZSBDQTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCC\
AgoCggIBAJy81BL/qHeDUWC8AS5mryYzAylP2q3m3AvvyNLjPfba/iFM4j1VZp8B\
HeYl9swou73eO32/nKLSg8y2xYJVj5FMifb0i9nl7CboSlIyE4NT1JfeF8+OZxhx\
S4nw2cILffTSgy7AZMZVlM4YekWOXYDQo8jGl7fq/+A5V4rGuBS9SxXspQkix2Jj\
wtO1Lj1yvRhpw7AvLP0jzVIVzdU53ZeGjkGdGxfhzpdy6TqEJWcokqMMVYZukxhR\
XoroZJsYqWfcuZAUmeBH30HIyeVFPxv3Fk3KW2heDl2rwEENMbhdYOThJ6v+xJib\
2Gyvh9XN+o8En31FDid5Cvmfl115zBoeBs1QiA7ulNaKqhtDZ3YOAC+mA5c+Edjc\
sso2E0+Ne43yZ1WiZJYffLDmY/YYCahh2CKxkFZ3vJfAqVWGWkICQJbYz0uuzdqU\
3BJ0N7LsCtLEm1PBDhnGWuOPvJDfYGJuS8pjlcgiaS4KjQ/3eb/os03QSsKHVa/f\
xbRTW/uBUva3YepmdV1R8+IqGEHAzknSosCK+rP/I0dOzY9kMySu314Qj18AY9ch\
p7uibsegH2ssiyj2TK+t+DyQV5JAEz8Hshi+otSW0JXBSt+rDlZ+faclyZp0ULkQ\
b2sZQJZqds+jPwEPH3tITLRgC8XfWQO32DaO2qg8lcIsYpVIRsFfAgMBAAGjZjBk\
MB0GA1UdDgQWBBRPRyBxE6bq0/zDMbKcSeHsCVTv/DAfBgNVHSMEGDAWgBRVtZz2\
akJzglT3nxWJwEB14QmQuDASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQE\
AwIBhjANBgkqhkiG9w0BAQsFAAOCAgEAUa1ICQSv5mkcs/MPdldZeCTKBrHPNN5G\
Rl6us+BcQk8qQWx5lxTC7DL5g8e7VSvtQkOvv4vW+TDizQfT/fZD02iSFQCaxAxm\
/10R/5+rBhNm6EsUZ+ygAScwYHM/3LV+hsNUIgyBK/uWujiU4FMLqXA4f6jnlijl\
DCrrAvzLnAZrKg3/XwFmZNdQ97nIqodunLNR70Cd7rkyRjI3OpIdEyj1NIsqpswo\
P6BqSi/D1nlWFFsrxw6I4MGzeNDQPpslV7O6p6IY6qZX0A/nl1G/jLRalxa4g/We\
xfN7cKaKkL6LijwgeZ0Ud9o9eaPa5hSjn/tmkJY+2FODlti+Fn9iNnCtL8hFVDIt\
VSwH4k0RF/LQGVynyr6VwNN4+UppvOrJs2tQL3Uv+d+T/MruRndmaaPgfbcWjJNP\
zGEIwTQiPJA9vRj1bub9rYzu39ZbPFDDFaoQ1VkAAgw1ZevTkqlO9cX1C3Ncp2oa\
b/jCcJ2rBN1pWdRR9pXMsYTI3lCSUtVXDgCnVZbyKWSPotyL063tjZ2qQD2HxsjR\
OruL+TMxqlB9MgnExIPnOqNnFrV6ygAukiFVkjE4/aW3mG6ppDGJzHgCqBKsM9X3\
bT8oy4LI3/sPr3W17qDss4AAXsANucydfVZF3a2rzq56+NkE1qiY4A3JjSM9FXEQ\
UcOKkZhG3LY=\
-----END CERTIFICATE-----"
#define CERT "-----BEGIN CERTIFICATE-----\
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\
-----END CERTIFICATE-----"
#define KEY "-----BEGIN PRIVATE KEY-----\
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\
okmLeKAnXwjgNexvZVJFx75B76GDHg==\
-----END PRIVATE KEY-----"
*/
// extern Preferences preferences;

static WiFiClient espClient;
static MqttClient client(espClient);

void MQTT_Client_Init(const char *ssid, const char *password, const char *id, String wifiName, UBYTE *Image);
void MQTT_Connect(const char *id, UBYTE *Image);
void MQTT_Loop(const char *id, String wifiName, UBYTE *Image);

#endif /* __MQTT */
