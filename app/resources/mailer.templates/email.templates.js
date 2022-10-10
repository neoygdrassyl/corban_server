const { styleEmail } = require("./style")

const emailHead = `
  <head><link rel="stylesheet" type="text/css" hs-webfonts="true" href="https://fonts.googleapis.com/css?family=Lato|Lato:i,b,bi">
    <title>Email template</title>
    <meta property="og:title" content="Email template">
    
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
    <style type="text/css">${styleEmail}</style>
    
  </head>
`
const emailFooter = `
    <table role="presentation" bgcolor="#F5F8FA" width="100%" >
        <tr>
            <td align="left" style="padding: 30px 30px;">
                <p style="color:#99ACC2"> Made for Corban </p>
                <a class="subtle-link" href="#"> Unsubscribe </a>      
            </td>
        </tr>
    </table> 
`
const emailBody = (conent) => {
  let title = 'CORBAN SOFTWARE';

  let infoTitle = "CORBAN SOFTWARE & DOVELA";
  let infoBody = "For more information about Corban Software and Dovela visit our site.";

  return `
<body bgcolor="#F5F8FA" style="width: 100%; margin: auto 0; padding:0; font-family:Lato, sans-serif; font-size:18px; color:#33475B; word-break:break-word">        
   
<! View in Browser Link --> 
      
<div id="email">

<table role="presentation" width="100%">
  <tr>

  <td bgcolor="#00A4BD" align="center" style="color: white;">
    
    <h1>${title}</h1>
    
  </td>
</table>

${conent}

<table role="presentation" bgcolor="#EAF0F6" width="100%" style="margin-top: 50px;" >
    <tr>
        <td align="center" style="padding: 30px 30px;">
            
        <h2>${infoTitle}</h2>
        <p>${infoBody}</p>
        <a href="#"> more info</a>      
        </td>
    </tr>
  </table>

<! Footer --> 
${emailFooter}

</div>
</body>
`}

const emailComposer = (content) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en">
    ${emailHead}
     ${emailBody(content)}
    </html>

`

// -------------------------- EMAIL TEMPLATES ---------------------- //


// Send Links to reset passwrod //
module.exports.resetPaswordHTML = (_lang, _link, _name, _surname) => {
  let title;
  let name;
  let body_1;
  let body_2;
  let btn;

  switch (_lang) {
    case 'en':
      title = 'FORGOT YOUR PASSWORD?';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'There was a request to change your password';
      body_2 = 'If you did not make this request, just ignore this email. Otherwise, please click the button below to change your password, you have 5 minutes before this request expires. If that happens, just request another recovery email.';
      btn = 'RESET PASSWORD';
      break;
    case 'es':
      title = 'CONTRASEÑA OLVIDADA?';
      name = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'Hubo una solicitud para cambiar su contraseña.';
      body_2 = 'Si no realizó esta solicitud, simplemente ignore este correo electrónico. De lo contrario, haga clic en el botón a continuación para cambiar su contraseña, tiene 5 minutos antes de que caduque esta solicitud. Si eso sucede, simplemente solicite otro correo electrónico de recuperación.';
      btn = 'RESTABLECER CONTRASEÑA';
      break;
    default:
      title = 'FORGOT YOUR PASSWORD?';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'There was a request to change your password';
      body_2 = 'If you did not make this request, just ignore this email. Otherwise, please click the button below to change your password, you have 5 minutes before this request expires. If that happens, just request another recovery email.';
      btn = 'RESET PASSWORD';
  }

  let emailContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
      <tr>
        <td>
          <h2>${title}</h2>
          <p>${name}</p>
          <p>${body_1}</p>
          <p>${body_2}</p>
          <a class="btn_link" href="${_link}">${btn}</a>
         </td> 
         </tr>
    </table>
    
    `;

  return emailComposer(emailContent)
}
module.exports.resetPaswordText = (_lang, _link, _name, _surname) => {
  let text = ""

  switch (_lang) {
    case 'en':
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      There was a request to change your password. \n 
      If you did not make this request, just ignore this email. Otherwise, please click the in the following link to change your password, you have 5 minutes before this request expires. If that happens, just request another recovery email.\n
      Recovery link: ${_link}`;
      break;
    case 'es':
      text = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Hubo una solicitud para cambiar su contraseña.
      Si no realizó esta solicitud, simplemente ignore este correo electrónico. De lo contrario, haga clic en el siguiente enlace para cambiar su contraseña, tiene 5 minutos antes de que caduque esta solicitud. Si eso sucede, simplemente solicite otro correo electrónico de recuperación.\n
      Enlace de recuperación: ${_link}`;
      break;
    default:
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      There was a request to change your password. \n 
      If you did not make this request, just ignore this email. Otherwise, please click the in the following link to change your password, you have 5 minutes before this request expires. If that happens, just request another recovery email.\n
      Recovery link: ${_link}`;

  }

  return text;
}

// Send Link to active new account //
module.exports.verifyAccountText = (_lang, _link, _name, _surname) => {
  let text = ""

  switch (_lang) {
    case 'en':
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      We have processed your registration form. \n 
      Now the next stop is to activate your account, If you did not make this request, just ignore this email. Otherwise, please click the in the following link to activate your account.\n
      Account activation link: ${_link}`;
      break;
    case 'es':
      text = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Hemos procesado su formulario de registro.
      Ahora, el próxima paso es activar su cuenta. Si no realizó esta solicitud, simplemente ignore este correo electrónico. De lo contrario, haga clic en el siguiente enlace para activar su cuenta.\n
      Enlace de recuperación: ${_link}`;
      break;
    default:
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      We have processed your registration form.. \n 
      Now the next stop is to activate your account, If you did not make this request, just ignore this email. Otherwise, please click the in the following link to activate your account.\n
      Enlace de activación de cuenta: ${_link}`;

  }

  return text;
}
module.exports.verifyAccountHTML = (_lang, _link, _name, _surname) => {
  let title;
  let name;
  let body_1;
  let body_2;
  let btn;

  switch (_lang) {
    case 'en':
      title = 'REGISTRATION FORM PROCESSED';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'We have processed your registration form.';
      body_2 = 'Now the next stop is to activate your account, If you did not make this request, just ignore this email. Otherwise, please click the in the following button to activate your account.';
      btn = 'ACTIVATE ACCOUNT';
      break;
    case 'es':
      title = 'FORMULARIO DE INSCRIPCIÓN PROCESADO';
      name = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'Hubo una solicitud para cambiar su contraseña.';
      body_2 = 'Ahora, el próxima paso es activar su cuenta. Si no realizó esta solicitud, simplemente ignore este correo electrónico. De lo contrario, haga clic en el siguiente botón para activar su cuenta.';
      btn = 'ACTIVAR CUENTA';
      break;
    default:
      title = 'REGISTRATION FORM PROCESSED';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'We have processed your registration form.';
      body_2 = 'Now the next stop is to activate your account, If you did not make this request, just ignore this email. Otherwise, please click the in the following button to activate your account.';
      btn = 'ACTIVATE ACCOUNT';
  }

  let emailContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
      <tr>
        <td>
          <h2>${title}</h2>
          <p>${name}</p>
          <p>${body_1}</p>
          <p>${body_2}</p>
          <a class="btn_link" href="${_link}">${btn}</a>
         </td> 
         </tr>
    </table>
    
    `;

  return emailComposer(emailContent)
}

// Notification once the user has activated the account //
module.exports.activateAccountText = (_lang,_link, _name, _surname) => {
  let text = ""

  switch (_lang) {
    case 'en':
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Your account has been successfully activated. \n
      You may now proceed into our site to use all our services in the next link.\n 
      Account login link: ${_link}`;
      break;
    case 'es':
      text = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Su cuenta ha sido activada exitosamente.
      Ahora puede acceder a nuestro sitio para utilizar todos nuestros servicios en el siguiente enlace.\n
      Enlace de inicio de sesión de cuenta: ${_link}`;
      break;
    default:
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Your account has been successfully activated. \n
      You may now proceed into our site to use all our services in the next link.\n 
      Account login link: ${_link}`;

  }

  return text;
}
module.exports.activateAccountHTML = (_lang, _link, _name, _surname) => {
  let title;
  let name;
  let body_1;
  let body_2;
  let btn;

  switch (_lang) {
    case 'en':
      title = 'ACCOUNT ACTIVATED SUCCESSFULLY';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'Your account has been successfully activated.';
      body_2 = 'You may now proceed into our site to use all our services clicking the next button.';
      btn = 'LOGIN';
      break;
    case 'es':
      title = 'CUENTA ACTIVADA CON ÉXITO';
      name = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'Su cuenta ha sido activada exitosamente.';
      body_2 = 'Ahora puede acceder a nuestro sitio para utilizar todos nuestros servicios haciendo clic en el siguiente botón.';
      btn = 'INICIAR SESIÓN';
      break;
    default:
      title = 'ACCOUNT ACTIVATED SUCCESSFULLY';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'Your account has been successfully activated.';
      body_2 = 'You may now proceed into our site to use all our services clicking the next button.';
      btn = 'LOGIN';
  }

  let emailContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
      <tr>
        <td>
          <h2>${title}</h2>
          <p>${name}</p>
          <p>${body_1}</p>
          <p>${body_2}</p>
          <a class="btn_link" href="${_link}">${btn}</a>
         </td> 
         </tr>
    </table>
    
    `;

  return emailComposer(emailContent)
}

// Send Link to invite user to team //
module.exports.inviteWorkTeamText = (_lang,_link, _name, _surname, _team) => {
  let text = ""

  switch (_lang) {
    case 'en':
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      You have been invited to join a team. \n
      The team ${_team} has sent you an invitation to be part of the team, click on the following link to accept or log into your account and check your notifications.\n 
      Invitation link: ${_link}`;
      break;
    case 'es':
      text = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Ha sido invitado a unirse a un equipo.\n
      El equipo ${_team} te ha enviado una invitación para ser parte del equipo, haz clic en el siguiente enlace para aceptar o inicia sesión en tu cuenta y revisa tus notificaciones.\n
      Enlace de invitación: ${_link}`;
      break;
    default:
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      You have been invited to join a team. \n
      The team ${_team} has sent you an invitation to be part of the team, click on the following link to accept or log into your account and check your notifications.\n 
      Invitation link: ${_link}`;

  }

  return text;
}
module.exports.inviteWorkTeamHTML = (_lang, _link, _name, _surname, _team) => {
  let title;
  let name;
  let body_1;
  let body_2;
  let btn;

  switch (_lang) {
    case 'en':
      title = 'WORK TEAM INVITATION';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'You have been invited to join a team.';
      body_2 = `The team ${_team} has sent you an invitation to be part of the team, click on the following button to accept or log into your account and check your notifications.`;
      btn = 'ACCEPT INVITATION';
      break;
    case 'es':
      title = 'INVITACIÓN EQUIPO DE TRABAJO';
      name = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'Ha sido invitado a unirse a un equipo.';
      body_2 = `El equipo ${_team} te ha enviado una invitación para ser parte del equipo, haz clic en el siguiente enlace para aceptar o inicia sesión en tu cuenta y revisa tus notificaciones.`;
      btn = 'ACEPTAR INVITACION';
      break;
    default:
      title = 'WORK TEAM INVITATION';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = 'You have been invited to join a team.';
      body_2 = `The team ${_team} has sent you an invitation to be part of the team, click on the following button to accept or log into your account and check your notifications.`;
      btn = 'ACCEPT INVITATION';
  }

  let emailContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
      <tr>
        <td>
          <h2>${title}</h2>
          <p>${name}</p>
          <p>${body_1}</p>
          <p>${body_2}</p>
          <a class="btn_link" href="${_link}">${btn}</a>
         </td> 
         </tr>
    </table>
    
    `;

  return emailComposer(emailContent)
}


// Notificaton TO THE USER once it has joined a team //
module.exports.userJoinedTeamText = (_lang,_name, _surname, _teamName) => {
  let text = ""

  switch (_lang) {
    case 'en':
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      You have successfully  joined to the team ${_teamName}. \n
      Now you can access to the team from your dashboard and participate in various tasks.`;
      break;
    case 'es':
      text = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Te has unido con éxito al equipo ${_teamName}. \n
      Ahora puedes acceder al equipo desde tu panel de control y participar en varias tareas.`;
      break;
    default:
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      You have successfully  joined to the team ${_teamName}. \n
      Now you can access to the team from your dashboard and participate in various tasks.`;

  }

  return text;
}
module.exports.userJoinedTeamHTML = (_lang, _name, _surname, _teamName) => {
  let title;
  let name;
  let body_1;
  let body_2;

  switch (_lang) {
    case 'en':
      title = 'JOINED TO TEAM SUCCESSFULLY';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = `You have successfully  joined to the team ${_teamName}.`;
      body_2 =  `Now you can access to the team from your dashboard and participate in various tasks.`;
      break;
    case 'es':
      title = 'CUENTA UNIDA AL EQUIPO CON ÉXITO';
      name = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = `Te has unido con éxito al equipo ${_teamName}.`;
      body_2 = `Ahora puedes acceder al equipo desde tu panel de control y participar en varias tareas.`;
      break;
    default:
      title = 'JOINED TO TEAM SUCCESSFULLY';
      name = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}`;
      body_1 = `You have successfully  joined to the team ${_teamName}.`;
      body_2 =  `Now you can access to the team from your dashboard and participate in various tasks.`;
  }

  let emailContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
      <tr>
        <td>
          <h2>${title}</h2>
          <p>${name}</p>
          <p>${body_1}</p>
          <p>${body_2}</p>
         </td> 
         </tr>
    </table>
    
    `;

  return emailComposer(emailContent)
}

// Notificaton TO THE TEAM once the user has joined a team //
module.exports.userJoinedTeam2Text = (_lang,_name, _surname, _teamName) => {
  let text = ""

  switch (_lang) {
    case 'en':
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      You have successfully  joined to the team ${_teamName}. \n
      Now you can access to the team from your dashboard and participate in various tasks.`;
      break;
    case 'es':
      text = `HOLA, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      Te has unido con éxito al equipo ${_teamName}. \n
      Ahora puedes acceder al equipo desde tu panel de control y participar en varias tareas.`;
      break;
    default:
      text = `HI, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()}. \n
      You have successfully  joined to the team ${_teamName}. \n
      Now you can access to the team from your dashboard and participate in various tasks.`;

  }

  return text;
}
module.exports.userJoinedTeam2HTML = (_lang, _name, _surname, _teamName) => {
  let title;
  let name;
  let body_1;
  let body_2;

  switch (_lang) {
    case 'en':
      title = 'JOINED TO TEAM SUCCESSFULLY';
      name = `HI TEAM OF ${String(_teamName).toUpperCase()}`;
      body_1 = `A new user has successfully join the team, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()} is now part of the team.`;
      body_2 =  `Remember  to set the user with a role in order to start acting on the software.`;
      break;
    case 'es':
      title = 'CUENTA UNIDA AL EQUIPO CON ÉXITO';
      name = `HOLA, EQUIPO DE ${String(_teamName).toUpperCase()}`;
      body_1 = `Un nuevo usuario se ha unido con éxito al equipo, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()} ahora es parte del equipo.`;
      body_2 = `Recuerde configurar el usuario con un rol para comenzar a actuar en el software.`;
      break;
    default:
      title = 'JOINED TO TEAM SUCCESSFULLY';
      name = `HI TEAM OF ${String(_teamName).toUpperCase()}`;
      body_1 = `A new user has successfully join the team, ${String(_name).toUpperCase()} ${String(_surname).toUpperCase()} is now part of the team.`;
      body_2 =  `Remember  to set the user with a role in order to start acting on the software.`;
  }

  let emailContent = `
    <table role="presentation" border="0" cellpadding="0" cellspacing="10px" style="padding: 30px 30px 30px 60px;">
      <tr>
        <td>
          <h2>${title}</h2>
          <p>${name}</p>
          <p>${body_1}</p>
          <p>${body_2}</p>
         </td> 
         </tr>
    </table>
    
    `;

  return emailComposer(emailContent)
}