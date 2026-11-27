
package backend.fido2_server.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fido2")
@CrossOrigin(origins = "http://localhost:3000")
public class Fido2Controller {

    private final JdbcTemplate jdbcTemplate;

    public Fido2Controller(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Fetch all users
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return jdbcTemplate.queryForList("SELECT * FROM app_users");
    }

    // Fetch all WebAuthn user entities
    @GetMapping("/user-entities")
    public List<Map<String, Object>> getUserEntities() {
        return jdbcTemplate.queryForList(
                "SELECT * FROM user_entities"
        );
    }

    // Fetch all registered credentials
    @GetMapping("/credentials")
    public List<Map<String, Object>> getCredentials() {
        return jdbcTemplate.queryForList(
                "SELECT * FROM user_credentials"
        );
    }

    // Fetch all FIDO2-related data
    @GetMapping("/all")
    public Map<String, Object> getAllData() {

        return Map.of(
                "users", getUsers(),
                "userEntities", getUserEntities(),
                "credentials", getCredentials()
        );
    }
}
