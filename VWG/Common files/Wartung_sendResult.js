//Wartung send mail
var java = JavaImporter(Packages.java.io, Packages.java.nio, Packages.java.nio.channels, Packages.java.lang, Packages.java.util, Packages.java.util.zip, Packages.java.text, Packages.java.net);
var g_oLogfile = null;
var g_nLoc = Context.getSelectedLanguage();
var email = "ext.Robert.Vajdik2@skoda-auto.cz";



Date.prototype.getMonthName = function() {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return monthNames[this.getMonth()];
}

function sendResulByEmail(subject) {

    g_oLogfile = new Logfile();
    g_oLogfile.init(java.String("append"), java.String("D:/SoftwareAG/"), java.String("send_email_wartung.txt"));
    g_oLogfile.writeLogEntry("Info", "--- Start send email --- ");

    if (validateEmail(email)) {
        g_oLogfile.writeLogEntry("Info", "User Email: " + email);
        g_oLogfile.writeLogEntry("Info", "Start sending info email");
        sendEmail(email, subject);
    }
    g_oLogfile.close();
}

function sendEmail(aRecipient, subject) {
    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " is sending --- ");
    var smtp_host = SchnellConfigReader.getConfigSection("EmailSetting", "SmtpHost", "Wartung_MailConfig.xml");
    var smtp_user = SchnellConfigReader.getConfigSection("EmailSetting", "SmtpUser", "Wartung_MailConfig.xml");
    var smtp_password = SchnellConfigReader.getConfigSection("EmailSetting", "SmtpPassword", "Wartung_MailConfig.xml");
    var smtp_port = SchnellConfigReader.getConfigSection("EmailSetting", "SmtpPort", "Wartung_MailConfig.xml");
    var smtp_tls = SchnellConfigReader.getConfigSection("EmailSetting", "SmtpEnableTLS", "Wartung_MailConfig.xml");
    var smtp_sender = SchnellConfigReader.getConfigSection("EmailSetting", "Sender", "Wartung_MailConfig.xml");
    var email_subject = SchnellConfigReader.getConfigSection("EmailSetting", "EmailSubject", "Wartung_MailConfig.xml");
    var use_authenticator = SchnellConfigReader.getConfigSection("EmailSetting", "UseAuthenticator", "Wartung_MailConfig.xml");
    var email_eml = SchnellConfigReader.getConfigSection("EmailSetting", "EmailEml", "Wartung_MailConfig.xml");

    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " will sent by host " + smtp_host + " --- ");
    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " will sent by user " + smtp_user + " --- ");
    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " will sent by port " + smtp_port + " --- ");
    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " will sent by tls " + smtp_tls + " --- ");
    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " will sent by sender " + smtp_sender + " --- ");
    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " will sent by subject " + email_subject + " --- ");
    var email_eml_template = Context.getFile(email_eml, Constants.LOCATION_COMMON_FILES);
    var email = new Packages.org.apache.commons.mail.MultiPartEmail();
    email.setHostName(smtp_host);
    email.setSmtpPort(smtp_port);
    if (smtp_tls.compareTo("true") == 0) email.setStartTLSEnabled(true);

    if (use_authenticator.compareTo("true") == 0) {
        email.setAuthenticator(new Packages.org.apache.commons.mail.DefaultAuthenticator(smtp_user, smtp_password));
    } else {
        if (smtp_user.length() > 0 && smtp_password.length() > 0) email.setAuthentication(smtp_user, smtp_password);
    }
    email.setFrom(smtp_sender);
    //email.setSubject(subject+ " (" + new Date().getMonth() + 1 +")");
     email.setSubject(subject+ " (" + new Date().getMonthName() + ")");
    
    //  var mimeMessage = new Packages.org.apache.commons.mail.util.MimeMessageUtils.createMimeMessage(null,email_eml_template);
    //  var parser = new Packages.org.apache.commons.mail.util.MimeMessageParser(mimeMessage);
    //  var attachments = parser.parse().getAttachmentList();     

    var attachment = new Packages.org.apache.commons.mail.EmailAttachment();
    attachment.setDisposition(attachment.ATTACHMENT);
    // attachment.setPath("c:\\temp\\test1.xls");
    var path = Context.getSelectedPath() + Context.getSelectedFile();
    attachment.setPath(path);
    attachment.setDescription( Context.getSelectedFile() );
    attachment.setName(subject + " (" + new Date().getMonthName() +")");

    email.attach(attachment);
    email.setStartTLSEnabled(true);  //RV 20220412 support TLS 
    email.setStartTLSRequired(true); //RV 20220412 support TLS
    
    email.addPart("Hello, here are file from monthly Wartung (" + new Date().getMonthName() + "). Please, see attached files.", "text/html;charset=UTF-8");
    email.addTo(aRecipient);
    // email.setText("Hellou");
     email.addCc("aris@skoda-auto.cz");
     email.addCc("daniel.masek@skoda-auto.cz");
    // email.addCc(aRecipient); //test
    // email.addBcc("robert.vajdik@idsa.cz"); //test
     

    g_oLogfile.writeLogEntry("Info", "--- OK now send email to " + aRecipient + " --- ");
    //send!!
    email.send();
    g_oLogfile.writeLogEntry("Info", "--- Email to " + aRecipient + " was sent --- ");
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}