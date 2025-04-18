// Diese Funktion wird aufgerufen, wenn der Benutzer auf die Zugriffsschaltfläche klickt
async function authenticateUser(area) {
  // Passwort aus dem Eingabefeld holen
  const passwordInput = document.getElementById(`password-${area}`);
  const password = passwordInput.value;
  
  // Fehlermeldung entfernen, falls vorhanden
  const existingError = document.querySelector(`#area-${area} .error-message`);
  if (existingError) {
      existingError.remove();
  }
  
  // Überprüfen, ob das Passwort eingegeben wurde
  if (!password) {
      showError(area, 'Bitte geben Sie ein Passwort ein.');
      return;
  }
  
  try {
      // Anfrage an die serverseitige Funktion senden
      const response = await fetch('/.netlify/functions/auth/validate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              area: area,
              password: password
          }),
      });
      
      const data = await response.json();
      
      if (data.success) {
          // Authentifizierung erfolgreich, Inhalt anzeigen
          document.querySelector(`#area-${area} .login-form`).classList.add('hidden');
          document.querySelector(`#content-${area}`).classList.remove('hidden');
          
          // Passwort in sessionStorage speichern, damit der Benutzer nicht bei jedem Seitenaufruf neu authentifizieren muss
          sessionStorage.setItem(`auth-${area}`, 'true');
      } else {
          // Authentifizierung fehlgeschlagen, Fehlermeldung anzeigen
          showError(area, 'Falsches Passwort. Bitte versuchen Sie es erneut.');
      }
  } catch (error) {
      console.error('Authentifizierungsfehler:', error);
      showError(area, 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
  }
}

// Hilfsfunktion zum Anzeigen von Fehlermeldungen
function showError(area, message) {
  const errorElement = document.createElement('p');
  errorElement.classList.add('error-message');
  errorElement.textContent = message;
  
  const loginForm = document.querySelector(`#area-${area} .login-form`);
  loginForm.appendChild(errorElement);
}

// Überprüfen, ob der Benutzer bereits authentifiziert ist (beim Laden der Seite)
document.addEventListener('DOMContentLoaded', function() {
  const areas = ['andi', 'ricardo', 'micha', 'enjo', 'mareen', 'sonstwer'];
  
  areas.forEach(area => {
      if (sessionStorage.getItem(`auth-${area}`) === 'true') {
          document.querySelector(`#area-${area} .login-form`).classList.add('hidden');
          document.querySelector(`#content-${area}`).classList.remove('hidden');
      }
      
      // Enter-Taste im Passwortfeld ermöglichen
      const passwordInput = document.getElementById(`password-${area}`);
      passwordInput.addEventListener('keyup', function(event) {
          if (event.key === 'Enter') {
              authenticateUser(area);
          }
      });
  });
});
          