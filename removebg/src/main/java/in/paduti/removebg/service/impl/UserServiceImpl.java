package in.paduti.removebg.service.impl;

import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

            String newPhotoUrl = userDTO.getPhotoUrl();
            if (newPhotoUrl != null && !newPhotoUrl.isEmpty()) {
                existingUser.setPhotoUrl(newPhotoUrl);
            }

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

    @Override
    public UserDTO getUserByClerkId(String clerkId) {
        UserEntity userEntity = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return mapToDTO(userEntity);
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

    private UserDTO mapToDTO(UserEntity entity) {
        return UserDTO.builder()
                .clerkId(entity.getClerkId())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .photoUrl(entity.getPhotoUrl())
                .credits(entity.getCredits())
                .build();
    }

    @Override
    public void deleteUserByClerkId(String clerkId) {
        UserEntity userEntity = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        userRepository.delete(userEntity);
    }
}
