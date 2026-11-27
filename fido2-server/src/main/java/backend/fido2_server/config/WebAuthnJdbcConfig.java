package backend.fido2_server.config;





import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.security.web.webauthn.management.JdbcPublicKeyCredentialUserEntityRepository;
import org.springframework.security.web.webauthn.management.JdbcUserCredentialRepository;

@Configuration
public class WebAuthnJdbcConfig {

    @Bean
    public JdbcPublicKeyCredentialUserEntityRepository
    jdbcPublicKeyCredentialUserEntityRepository(JdbcOperations jdbc) {
        return new JdbcPublicKeyCredentialUserEntityRepository(jdbc);
    }

    @Bean
    public JdbcUserCredentialRepository
    jdbcUserCredentialRepository(JdbcOperations jdbc) {
        return new JdbcUserCredentialRepository(jdbc);
    }

    @Bean
    public org.springframework.boot.ApplicationRunner
    verifyWebAuthnRepositories(
            JdbcUserCredentialRepository credentials,
            JdbcPublicKeyCredentialUserEntityRepository entities) {

        return args -> {
            System.out.println("Credential Repository: " + credentials);
            System.out.println("User Entity Repository: " + entities);
        };
    }
}






