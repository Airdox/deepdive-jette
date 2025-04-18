exports.handler = async function(event, context) {
  // CORS-Header für lokale Entwicklung
  const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  
  // OPTIONS-Anfragen für CORS behandeln
  if (event.httpMethod === "OPTIONS") {
      return {
          statusCode: 200,
          headers,
          body: ""
      };
  }
  
  // Nur POST-Anfragen akzeptieren
  if (event.httpMethod !== "POST") {
      return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ success: false, message: "Method Not Allowed" })
      };
  }
  
  try {
      // Request-Body parsen
      const requestBody = JSON.parse(event.body);
      const { area, password } = requestBody;
      
      // Prüfen, ob alle erforderlichen Felder vorhanden sind
      if (!area || !password) {
          return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ success: false, message: "Missing required fields" })
          };
      }
      
      // In einer echten Anwendung würden diese Passwörter in einer Datenbank oder als Umgebungsvariablen gespeichert werden
      // Umgebungsvariablen können in der Netlify-Benutzeroberfläche festgelegt werden
      
      // Auf Passwörter aus Umgebungsvariablen zugreifen oder Fallback verwenden
      const passwords = {
          andi: process.env.PASSWORD_ANDI || "andi123",
          ricardo: process.env.PASSWORD_RICARDO || "ricardo123",
          micha: process.env.PASSWORD_MICHA || "micha123",
          enjo: process.env.PASSWORD_ENJO || "enjo123",
          mareen: process.env.PASSWORD_MAREEN || "mareen123",
          sonstwer: process.env.PASSWORD_SONSTWER || "sonstwer123"
      };
      
      // Prüfen, ob der Bereich existiert
      if (!passwords[area]) {
          return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ success: false, message: "Area not found" })
          };
      }
      
      // Passwortvalidierung
      const isValid = password === passwords[area];
      
      // Antwort senden
      return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
              success: isValid,
              message: isValid ? "Authentication successful" : "Invalid password"
          })
      };
      
  } catch (error) {
      console.error("Error during authentication:", error);
      
      return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: "Internal Server Error" })
      };
  }
};
          