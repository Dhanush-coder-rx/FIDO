package backend.fido2_server.controller;



import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;


@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> health() {

        return Map.of(
                "application", "FIDO2 Authentication",
                "status", "Running",
                "backend", "Spring Boot"
        );
    }

    @GetMapping("/")
    public Map<String, Object> home(Authentication authentication) {

        return Map.of(
                "message", "FIDO2 Server is running",
                "authenticated", authentication != null
                        && authentication.isAuthenticated(),
                "username", authentication != null
                        ? authentication.getName()
                        : "Anonymous"
        );
    }

    @GetMapping("/api/auth/status")
    public Map<String, Object> authStatus(
            Authentication authentication) {

        return Map.of(
                "authenticated", authentication != null
                        && authentication.isAuthenticated(),
                "username", authentication.getName()
        );
    }

    @GetMapping("/api/csrf")
    public Map<String, String> csrf(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        return Map.of(
                "token", token.getToken(),
                "headerName", token.getHeaderName(),
                "parameterName", token.getParameterName()
        );
    }
}
