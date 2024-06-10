import { NativeModules } from 'react-native';
import { encode, decode } from 'base-64';
import { Algorithms } from '../types/type';

const config = {
    ditheringThreshold: 128,
    width: 128,     // px
    height: 296     //px
};

const bayerThresholdMap = [
    [15, 135, 45, 165],
    [195, 75, 225, 105],
    [60, 180, 30, 150],
    [240, 120, 210, 90],
];

export const getByteArray = async (encode, horizontal: boolean = false, width = 128, height = 296) => {
    const res = await NativeModules.Bitmap.getPixelsFull(encode, horizontal)
        .then((image) => {
            return image;
        })
        .catch((err) => {
            console.error(err);
        });

    return {
        width: res.width,
        height: res.height,
        pixels: res.pixels,
        hasAlpha: res.hasAlpha
    };
}

export const ditheringGrayscale = (byteArray, algorithm: Algorithms) => {
    const lumR: number[] = [];
    const lumG: number[] = [];
    const lumB: number[] = [];
    for (let i = 0; i < 256; i++) {
        lumR[i] = i * 0.299;
        lumG[i] = i * 0.587;
        lumB[i] = i * 0.114;
    }
    // Convert to Greyscale luminance
    const pixelAverageRGB = Uint8ClampedArray.from(byteArray.map(it => {
        return Math.floor((
            lumR[Number("0x" + it.slice(2, 4))] +  // red
            lumG[Number("0x" + it.slice(4, 6))] +  // green
            lumB[Number("0x" + it.slice(6, 8))]    // blue
        ))
    }))

    // Dithering pixels - Floyd-Steinberg
    let err;
    const newPixelsArray = Uint8ClampedArray.from(pixelAverageRGB);
    if (algorithm === Algorithms.binary) {
        // No dithering
        for (let index = 0; index < newPixelsArray.length; index++) {
            newPixelsArray[index] = newPixelsArray[index] < 129 ? 0 : 255;
        };
    }
    else if (algorithm === Algorithms.bayer) {
        // 4x4 Bayer ordered dithering algorithm
        for (let index = 0; index < newPixelsArray.length; index++) {
            const x = index % config.width;
            const y = Math.floor(index / config.width);
            const map = Math.floor((newPixelsArray[index] + bayerThresholdMap[x % 4][y % 4]) / 2);
            newPixelsArray[index] = (map < 129) ? 0 : 255;
        };

    }
    else if (algorithm === Algorithms.floydsteinberg) {

        for (let index = 0; index < newPixelsArray.length; index++) {
            let newPixel = newPixelsArray[index] < 129 ? 0 : 255;

            err = Math.floor((newPixelsArray[index] - newPixel) / 16);
            newPixelsArray[index] = newPixel;

            if ((index + 1) % config.width !== 0) {
                newPixelsArray[index + 1] += err * 7;
                if (index + config.width + 1 <= config.height * config.width) {
                    newPixelsArray[index + config.width + 1] += err * 1;
                }
            }
            if (index % config.width !== 0) {
                if (index + config.width - 1 <= config.height * config.width) {
                    newPixelsArray[index + config.width - 1] += err * 3;
                }
            }
            if (index + config.width <= config.height * config.width) {
                newPixelsArray[index + config.width] += err * 5;
            }
        };
    }
    else if (algorithm === Algorithms.atkinson) {
        // Bill Atkinson's dithering algorithm
        for (let index = 0; index < newPixelsArray.length; index++) {
            let newPixel = newPixelsArray[index] < 129 ? 0 : 255;

            err = Math.floor((newPixelsArray[index] - newPixel) / 8);
            newPixelsArray[index] = newPixel;

            // Last + 1 px of row check
            if ((index + 1) % config.width !== 0) {
                newPixelsArray[index + 1] += err;
                if (index + config.width + 1 <= config.height * config.width) {
                    newPixelsArray[index + config.width + 1] += err;
                }
            }
            // First px of row check
            if (index % config.width !== 0) {
                if (index + config.width - 1 <= config.height * config.width) {
                    newPixelsArray[index + config.width - 1] += err;
                }
            }
            // Last px row of array check
            if (index + config.width <= config.height * config.width) {
                newPixelsArray[index + config.width] += err;
            }
            // Last + 2 px of row check
            if ((index + 2) % config.width !== 0 && index + 2 <= config.height * config.width) {
                newPixelsArray[index + 2] += err;
            }
            // Last + 2 px row of array check
            if (index + 2 * config.width <= config.height * config.width) {
                newPixelsArray[index + 2 * config.width] += err;
            }
        };

    }

    // Convert to 8-bit per pixel format
    let stringFromBytes = '';
    let byteIndex = 7;
    let number = 0;

    for (let index = 0; index < newPixelsArray.length; index++) {
        if (newPixelsArray[index] > config.ditheringThreshold) {
            number += 2 ** byteIndex;
        }
        byteIndex--;

        // if this was the last pixel of a row or the last pixel of the
        // image, fill up the rest of our byte with zeros so it always contains 8 bits
        if ((index !== 0 && ((index + 1) % (config.width)) === 0) || (index === newPixelsArray.length - 1)) {
            byteIndex = -1;
        }

        // When we have the complete 8 bits, combine them into a hex value
        if (byteIndex < 0) {
            stringFromBytes += String.fromCharCode(number);
            number = 0;
            byteIndex = 7;
        }
    }

    return {
        bitmap: encode(stringFromBytes),
        pixels: Array.from(newPixelsArray)
    };
}

export const decodeImageData = (base64: string) => {
    try {
        const imageData: string = decode(base64);

        const pixelsArray = new Uint8ClampedArray(imageData.length * 8).fill(0);
        for (let index = 0; index < imageData.length; index++) {
            let temp = imageData[index].charCodeAt(0);

            let cur = index * 8 + 7;
            while (temp > 0) {
                pixelsArray[cur] = (temp % 2) * 255;
                cur--;
                temp = Math.floor(temp / 2);
            }
        }

        return Array.from(pixelsArray);
    }
    catch (e) {
        console.log(e);
        return Array.from(new Uint8ClampedArray(0));
    }
}