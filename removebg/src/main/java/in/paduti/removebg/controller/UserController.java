package in.paduti.removebg.controller;

import org.springframework.web.bind.annotation.RestController;

import in.paduti.removebg.dto.UserDTO;
import in.paduti.removebg.response.RemoveBgResponse;
import in.paduti.removebg.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createOrUpdateUser(@RequestBody UserDTO userDTO, Authentication authentication) {

        RemoveBgResponse response = null;
        try {

            if (!authentication.getName().equals(userDTO.getClerkId())) {

                response = RemoveBgResponse.builder()
                        .success(false)
                        .data("User does not have permission to access this resource")
                        .statusCode(HttpStatus.FORBIDDEN)
                        .build();
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);

            }

            UserDTO user = userService.saveUser(userDTO);
            response = RemoveBgResponse.builder()
                    .success(true)
                    .data(user)
                    .statusCode(HttpStatus.OK)
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception exception) {
            response = RemoveBgResponse.builder()
                    .success(false)
                    .data(exception.getMessage())
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(Authentication authentication) {
        RemoveBgResponse response = null;
        try {
            if (authentication.getName() == null || authentication.getName().isEmpty()) {
                response = RemoveBgResponse.builder()
                        .success(false)
                        .data("User does not have permission to access this resource")
                        .statusCode(HttpStatus.FORBIDDEN)
                        .build();
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            String clerkId = authentication.getName();
            UserDTO existingUser = userService.getUserByClerkId(clerkId);
            Map<String, Integer> data = new HashMap<>();
            data.put("credits", existingUser.getCredits());
            response = RemoveBgResponse.builder()
                    .success(true)
                    .data(data)
                    .statusCode(HttpStatus.OK)
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response = RemoveBgResponse.builder()
                    .success(false)
                    .data("Something went wrong")
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
