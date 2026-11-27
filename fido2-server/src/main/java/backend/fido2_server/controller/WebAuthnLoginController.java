package backend.fido2_server.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@RestController
public class WebAuthnLoginController {

    private final JdbcTemplate jdbcTemplate;

    public WebAuthnLoginController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Returns the credential IDs registered for a given username.
     * The frontend uses these as allowCredentials so the browser only
     * prompts the passkey that belongs to this user.
     */
    @PostMapping("/api/webauthn/login/options")
    public Map<String, Object> loginOptions(
            @RequestBody Map<String, String> body,
            HttpServletResponse response) {

        String username = body.get("username");
        if (username == null || username.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return Map.of("error", "Username is required");
        }

        // Look up the user entity by name
        List<Map<String, Object>> entities = jdbcTemplate.queryForList(
                "SELECT id FROM user_entities WHERE name = ?", username.trim());

        if (entities.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return Map.of("error", "No passkey registered for this username");
        }

        String userId = (String) entities.get(0).get("id");

        // Get all credential IDs for this user
        List<String> credentialIds = jdbcTemplate.queryForList(
                "SELECT credential_id FROM user_credentials WHERE user_entity_user_id = ?",
                String.class, userId);

        if (credentialIds.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return Map.of("error", "No passkey registered for this username");
        }

        return Map.of("credentialIds", credentialIds);
    }
}
