package backend.fido2_server.service;

import backend.fido2_server.entity.AppUser;
import backend.fido2_server.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // No password in this system — passkey IS the credential.
        // Spring Security requires a non-null password field; we use a dummy noop value.
        return User.withUsername(user.getUsername())
                .password("{noop}PASSKEY_ONLY")
                .roles("USER")
                .disabled(!user.isEnabled())
                .build();
    }

    public AppUser registerUser(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }
        return userRepository.save(new AppUser(username));
    }
}
