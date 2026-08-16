package com.example.watermark.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.watermark.dto.DecoderRequest;
import com.example.watermark.dto.DecoderResponse;
import com.example.watermark.dto.EncoderRequest;
import com.example.watermark.dto.EncoderResponse;
import com.example.watermark.service.WatermarkService;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/watermark")
public class WatermarkController {
    private final WatermarkService watermarkService;

    public WatermarkController(WatermarkService watermarkService) {
        this.watermarkService = watermarkService;
    }

    @PostMapping("/encode")
    public EncoderResponse encode(@RequestBody EncoderRequest request) {
        String encoded = watermarkService.encode(request.text(), request.watermarkData());
        return new EncoderResponse(encoded);
    }

    @PostMapping("/decode")
    public DecoderResponse decode(@RequestBody DecoderRequest request) {
        String decoded = watermarkService.decode(request.text());
        return new DecoderResponse(decoded);
    }
    
}
