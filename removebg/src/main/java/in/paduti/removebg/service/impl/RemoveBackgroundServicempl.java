package in.paduti.removebg.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import in.paduti.removebg.client.ClipdropClient;
import in.paduti.removebg.service.RemoveBackgroundService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RemoveBackgroundServicempl implements RemoveBackgroundService {

    @Value("${clipdrop.api-key}")
    private String apiKey;

    private final ClipdropClient clipdropClient;

    @Override
    public byte[] removeBackground(MultipartFile file) {
        return clipdropClient.RemoveBackground(file, apiKey);
    }

}
