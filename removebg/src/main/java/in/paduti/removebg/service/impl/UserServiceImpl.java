package in.paduti.removebg.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

import in.paduti.removebg.dto.UserDTO;
import in.paduti.removebg.entity.UserEntity;
import in.paduti.removebg.service.UserService;
import lombok.RequiredArgsConstructor;
import in.paduti.removebg.repository.userRepository;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final userRepository userRepository;

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
        Optional<UserEntity> optionalUser = userRepository.findByClerkId(userDTO.getClerkId());
        if (optionalUser.isPresent()) {
            UserEntity existingUser = optionalUser.get();
            existingUser.setEmail(userDTO.getEmail());
            existingUser.setFirstName(userDTO.getFirstName());
            existingUser.setLastName(userDTO.getLastName());
            existingUser.setPhotoUrl(userDTO.getPhotoUrl());
            if (userDTO.getCredits() != null) {
                existingUser.setCredits(userDTO.getCredits());
            }
            existingUser = userRepository.save(existingUser);
            return mapToDTO(existingUser);
        }
        UserEntity newUser = mapToEntity(userDTO);
        userRepository.save(newUser);
        return mapToDTO(newUser);
    }

    private UserEntity mapToEntity(UserDTO userDTO) {
        return UserEntity.builder()
                .clerkId(userDTO.getClerkId())
                .credits(userDTO.getCredits())
                .email(userDTO.getEmail())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .photoUrl(userDTO.getPhotoUrl())
                .build();
    }

    private UserDTO mapToDTO(UserEntity newUser) {
        return UserDTO.builder()
                .clerkId(newUser.getClerkId())
                .email(newUser.getEmail())
                .firstName(newUser.getFirstName())
                .lastName(newUser.getLastName())
                .photoUrl(newUser.getPhotoUrl())
                .credits(newUser.getCredits())
                .build();
    }

    @Override
    public UserDTO getUserByClerkId(String clerkId) {
        UserEntity userEntity = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return mapToDTO(userEntity);
    }
}
