package in.paduti.removebg.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import in.paduti.removebg.response.RemoveBgResponse;
import in.paduti.removebg.dto.UserDTO;
import in.paduti.removebg.service.UserService;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class ClerkWebhookController {

    @Value("${clerk.webhook.secret}")
    private String webhookSecret;

    private final UserService userService;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(
            @RequestHeader("svix-id") String svixId,
            @RequestHeader("svix-timestamp") String svixTimestamp,
            @RequestHeader("svix-signature") String svixSignature,
            @RequestBody String payload) {

        RemoveBgResponse response;

        try {
            boolean isValid = verifyWebhookSignature(svixId, svixTimestamp, svixSignature, payload);
            if (!isValid) {
                response = RemoveBgResponse.builder()
                        .statusCode(HttpStatus.UNAUTHORIZED)
                        .data("Invalid webhook signature")
                        .success(false)
                        .build();
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(payload);
            String eventType = rootNode.path("type").asText();

            switch (eventType) {
                case "user.created":
                    handleUserCreate(rootNode.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdate(rootNode.path("data"));
                    break;
                case "user.deleted":
                    handleUserDelete(rootNode.path("data"));
                    break;
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            response = RemoveBgResponse.builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Something went wrong")
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private void handleUserCreate(JsonNode userData) {
        UserDTO newUser = UserDTO.builder()
                .clerkId(userData.path("id").asText())
                .email(userData.path("email_addresses").path(0).path("email_address").asText())
                .firstName(userData.path("first_name").asText())
                .lastName(userData.path("last_name").asText())
                .photoUrl(userData.path("image_url").asText())
                .build();
        userService.saveUser(newUser);
    }

    private void handleUserUpdate(JsonNode userData) {
        String clerkId = userData.path("id").asText();
        UserDTO existingUser = userService.getUserByClerkId(clerkId);

        existingUser.setEmail(userData.path("email_addresses").path(0).path("email_address").asText());
        existingUser.setFirstName(userData.path("first_name").asText());
        existingUser.setLastName(userData.path("last_name").asText());

        String newPhotoUrl = userData.path("image_url").asText();
        if (newPhotoUrl != null && !newPhotoUrl.isEmpty()) {
            existingUser.setPhotoUrl(newPhotoUrl);
        }

        userService.saveUser(existingUser);
    }

    private void handleUserDelete(JsonNode userData) {
        String clerkId = userData.path("id").asText();
        userService.deleteUserByClerkId(clerkId);
    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        return true;
    }
}
