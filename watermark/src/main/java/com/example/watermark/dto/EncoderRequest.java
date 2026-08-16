package com.example.watermark.dto;

public record EncoderRequest(
    String text,
    String watermarkData
) {

}
