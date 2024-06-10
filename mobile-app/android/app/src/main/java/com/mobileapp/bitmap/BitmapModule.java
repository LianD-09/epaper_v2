package com.mobileapp.bitmap;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import java.io.IOException;
import java.util.Base64;

public class BitmapModule extends ReactContextBaseJavaModule {

    public BitmapModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Bitmap";
    }


    @ReactMethod
    public void getPixelsFull(String encodedImage, boolean horizontal, final Promise promise) {
        try {
            WritableNativeMap result = new WritableNativeMap();
            WritableNativeArray pixels = new WritableNativeArray();
            WritableNativeArray averagePixels = new WritableNativeArray();

            // Bitmap bitmap = BitmapFactory.decodeFile(filePath);
            byte[] decodedBytes = Base64.getMimeDecoder().decode(encodedImage);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            int width;
            int height;
            // scale down epd size
            if (horizontal) {
                bitmap = Bitmap.createScaledBitmap(bitmap, 296, 128, false);
                width = bitmap.getWidth();
                height = bitmap.getHeight();

                for (int y = 0; y < width; y++) {
                    for (int x = height - 1; x >= 0; x--) {
                        int color = bitmap.getPixel(y, x);
                        String hex = Integer.toHexString(color);
                        pixels.pushString(hex);
                    }
                }
            } else {
                bitmap = Bitmap.createScaledBitmap(bitmap, 128, 296, false);
                width = bitmap.getWidth();
                height = bitmap.getHeight();

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        int color = bitmap.getPixel(x, y);
                        String hex = Integer.toHexString(color);
                        pixels.pushString(hex);
                    }
                }
            }

            boolean hasAlpha = bitmap.hasAlpha();


            result.putInt("width", width);
            result.putInt("height", height);
            result.putBoolean("hasAlpha", hasAlpha);
            result.putArray("pixels", pixels);
            promise.resolve(result);

        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getPixels(String encodedImage, int imgWidth, int imgHeight, boolean horizontal, final Promise promise) {
        try {
            WritableNativeMap result = new WritableNativeMap();
            WritableNativeArray pixels = new WritableNativeArray();
            WritableNativeArray averagePixels = new WritableNativeArray();

            // Bitmap bitmap = BitmapFactory.decodeFile(filePath);
            byte[] decodedBytes = Base64.getMimeDecoder().decode(encodedImage);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
            if (bitmap == null) {
                promise.reject("Failed to decode. Path is incorrect or image is corrupted");
                return;
            }

            int scaleWidth = 0;
            int scaleHeight = 0;
            if (296 * imgWidth / imgHeight <= 128) {
                scaleWidth = 296 * imgWidth / imgHeight;
                scaleHeight = 296;
            } else if (128 * imgHeight / imgWidth <= 296) {
                scaleHeight = 128 * imgHeight / imgWidth;
                scaleWidth = 128;
            }

            int width;
            int height;
            // scale down epd size
            if (horizontal) {
                bitmap = Bitmap.createScaledBitmap(bitmap, scaleHeight, scaleWidth, false);
                width = bitmap.getWidth();
                height = bitmap.getHeight();

                for (int y = 0; y < width; y++) {
                    for (int x = height - 1; x >= 0; x--) {
                        int color = bitmap.getPixel(y, x);
                        String hex = Integer.toHexString(color);
                        pixels.pushString(hex);
                    }
                }
            } else {
                bitmap = Bitmap.createScaledBitmap(bitmap, scaleWidth,  scaleHeight, false);
                width = bitmap.getWidth();
                height = bitmap.getHeight();

                for (int y = 0; y < height; y++) {
                    for (int x = 0; x < width; x++) {
                        int color = bitmap.getPixel(x, y);
                        String hex = Integer.toHexString(color);
                        pixels.pushString(hex);
                    }
                }
            }

            boolean hasAlpha = bitmap.hasAlpha();


            result.putInt("width", width);
            result.putInt("height", height);
            result.putBoolean("hasAlpha", hasAlpha);
            result.putArray("pixels", pixels);
            promise.resolve(result);

        } catch (Exception e) {
            promise.reject(e);
        }

    }
}