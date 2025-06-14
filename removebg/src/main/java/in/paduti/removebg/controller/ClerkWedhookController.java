package main.java.in.paduti.removebg.controller;

import in.paduti.removebg.service.UserService;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class ClerkWedhookController {

    @Value("${clerk.webhook.secret}")
    private String wedhookSecret;

    private final UserService userService;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(@RequestHeader("svix-id") String svixId,
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
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(response);
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
                    .data("Somethinh went wrong")
                    .success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    private void handleUserCreate(JsonNode userData) {
        UserDTO newUser = UserDTO.builder()
                .clerkId(data.path("id").asText())
                .email(data.path("email_addresses").path(0).path("email_address").asText())
                .firstName(data.path("first_name").asText())
                .lastName(data.path("last_name").asText())
                .build();
        userService.createUser(newUser);
    }

    private void handleUserUpdate(JsonNode userData) {
        String clerkId = data.path("id").asText();
        UserDTO existingUser = userService.getUserByClerkId(clerkId);
        existingUser.setEmail(data.path("email_addresses").path(0).path("email_address").asText());
        existingUser.setFirstName(data.path("first_name").asText());
        existingUser.setLastName(data.path("last_name").asText());
        existingUser.setPhotoUrl(data.path("image_url").asText());
        userService.saveUser(existingUser);
    }

    private void handleUserDelete(JsonNode userData) {
        // Implement the logic to handle user deletion
        // This is a placeholder for the actual implementation
    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
        // Implement the logic to verify the webhook signature using the wedhookSecret
        // This is a placeholder for the actual implementation
        return true; // Return true if the signature is valid, false otherwise
    }

}
