
export function base64urlToBuffer(value) {
  const base64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const binary = atob(
    base64 + '='.repeat((4 - base64.length % 4) % 4)
  );

  return Uint8Array.from(
    binary,
    character => character.charCodeAt(0)
  ).buffer;
}

export function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);

  let binary = '';

  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function getCsrfToken() {
  const response = await fetch(
    'http://localhost:8080/api/csrf',
    {
      method: 'GET',
      credentials: 'include'
    }
  );

  if (!response.ok) {
    throw new Error('Unable to obtain CSRF token');
  }

  const data = await response.json();

  return data.token;
}

export function serializeRegistration(credential, label) {
  return {
    publicKey: {
      credential: {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        type: credential.type,

        response: {
          attestationObject: bufferToBase64url(
            credential.response.attestationObject
          ),

          clientDataJSON: bufferToBase64url(
            credential.response.clientDataJSON
          ),

          transports: credential.response.getTransports
            ? credential.response.getTransports()
            : []
        },

        clientExtensionResults:
          credential.getClientExtensionResults(),

        authenticatorAttachment:
          credential.authenticatorAttachment
      },

      label
    }
  };
}

export function serializeAuthentication(credential) {
  return {
    id: credential.id,

    rawId: bufferToBase64url(credential.rawId),

    type: credential.type,

    response: {
      authenticatorData: bufferToBase64url(
        credential.response.authenticatorData
      ),

      clientDataJSON: bufferToBase64url(
        credential.response.clientDataJSON
      ),

      signature: bufferToBase64url(
        credential.response.signature
      ),

      userHandle: credential.response.userHandle
        ? bufferToBase64url(credential.response.userHandle)
        : null
    },

    clientExtensionResults:
      credential.getClientExtensionResults(),

    authenticatorAttachment:
      credential.authenticatorAttachment
  };
}
