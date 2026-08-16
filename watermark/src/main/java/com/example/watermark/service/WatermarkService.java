package com.example.watermark.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WatermarkService {

    public String encode(String text, String watermarkData) {
      int firstCodepoint = text.codePointAt(0);
      int firstCharLen = Character.charCount(firstCodepoint);

      StringBuilder result = new StringBuilder();
      result.appendCodePoint(firstCodepoint);

      byte[] bytes = watermarkData.getBytes(StandardCharsets.UTF_8);
      for (byte b : bytes) {
          int unsigned = b & 0xFF;
          result.appendCodePoint(byteToVariationSelector(unsigned));
      }

      result.append(text, firstCharLen, text.length());
      return result.toString();
    }

    public String decode(String encodedText) {
        byte[] bytes = decodeBytes(encodedText);
        return new String(bytes, StandardCharsets.UTF_8);
    }

    private int byteToVariationSelector(int b) {
        if (b < 16) {
            return 0xFE00 + b;
        } else {
            return 0xE0100 + (b - 16);
        }
    }

    private Optional<Integer> variationSelectorToByte(int variationSelector) {
        if (variationSelector >= 0xFE00 && variationSelector <= 0xFE0F) {
            return Optional.of(variationSelector - 0xFE00);
        } else if (variationSelector >= 0xE0100 && variationSelector <= 0xE01EF) {
            return Optional.of(variationSelector - 0xE0100 + 16);
        } else {
            return Optional.empty();
        }
    }

    private byte[] decodeBytes(String variationSelectors) {
        List<Byte> result = new ArrayList<>();

        int i = 0;
        while (i < variationSelectors.length()) {
            int codepoint = variationSelectors.codePointAt(i);
            i += Character.charCount(codepoint);

            Optional<Integer> b = variationSelectorToByte(codepoint);
            if (b.isPresent()) {
                result.add(b.get().byteValue());
            } else if (!result.isEmpty()) {
                break;
            }
        }

        byte[] bytes = new byte[result.size()];
        for (int j = 0; j < bytes.length; j++) {
            bytes[j] = result.get(j);
        }
        return bytes;
    }
}