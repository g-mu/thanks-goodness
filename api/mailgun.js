//https://api:key-3ax6xnjp29jd6fds4gc373sgvjxteol0@api.mailgun.net/v3/samples.mailgun.org/log
import HelperFunctions from "../constants/HelperFunctions";
import stateManager from "./stateManager";

const mailDomain = 'thanksgoodness.com';
const fromEmail = 'thanks@thanksgoodness.com';
const apiLocation = 'api.mailgun.net/v3/' + mailDomain + '/';
const userString = 'api:key-69a2422e72799017d8b5611a4d5c831f';

export const mailgunConfig = {
    mailDomain: mailDomain,
    fromEmail: fromEmail,
    userString: userString,
    webBaseUrl: 'https://' + apiLocation,
    sendTestEmail: function(){
        console.log('Sending test email');
        const formData = new FormData();
        formData.append('from', fromEmail);
        formData.append('to', 'gordonmueller@msn.com');
        formData.append('subject', 'Thanks test');
        formData.append('html', '<html>Test of Mailgun integration!<br/><a href="' + Expo.Constants.linkingUri + '">Click here</a> to open the app.<br><a href="http://thanksgoodness.com">Click here</a> to open the site.</html>');
        fetch(mailgunConfig.webBaseUrl + 'messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + HelperFunctions.Base64.btoa(mailgunConfig.userString),
                "Content-Type": "multipart/form-data"
            },
            body: formData
        }).then((response) => {
            console.log('Email response',response);
        }).catch((error) => {
            console.log('Email error',error);
        });
    },
    sendMerit: function(to, imageurl, message) {
        console.log('Sending merit to', to);
        const formData = new FormData();
        formData.append('from', fromEmail);
        formData.append('to', to);
        formData.append('subject', 'You are being thanked!');
        formData.append('html', `<html>
                    ${stateManager.user.firstname} ${stateManager.user.lastname} sent you a Thanks!<br><br>
                    <img src="${imageurl}" height="100"/><br>
                    "${message}"<br/><br/><br/>
                    <a href="http://thanksgoodness.com">Open the Thanks Goodness app to see more.</a>
                </html>`);
        fetch(mailgunConfig.webBaseUrl + 'messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + HelperFunctions.Base64.btoa(mailgunConfig.userString),
                "Content-Type": "multipart/form-data"
            },
            body: formData
        }).then((response) => {
            console.log('Email response',response);
        }).catch((error) => {
            console.log('Email error',error);
        });
    }
}
