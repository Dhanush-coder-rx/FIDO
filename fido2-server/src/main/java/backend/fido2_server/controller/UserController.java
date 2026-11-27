package backend.fido2_server.controller;

import backend.fido2_server.entity.AppUser;
import backend.fido2_server.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final HttpSessionSecurityContextRepository securityContextRepository;

    public UserController(UserService userService, HttpSessionSecurityContextRepository securityContextRepository) {
        this.userService = userService;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/register")
    public Map<String, Object> register(
            @RequestBody Map<String, String> body,
            HttpServletRequest request,
            HttpServletResponse response) {

        String username = body.get("username");

        if (username == null || username.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return Map.of("success", false, "error", "Username is required");
        }

        try {
            AppUser user = userService.registerUser(username.trim());

            var auth = new UsernamePasswordAuthenticationToken(
                    user.getUsername(), null,
                    List.of(new SimpleGrantedAuthority("ROLE_USER"))
            );
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            return Map.of("success", true, "username", user.getUsername());

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            return Map.of("success", false, "error", e.getMessage());
        }
    }
}
