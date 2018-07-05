---
title: APNS Setup
permalink: /ios/apns-setup/
layout: guide
secondary_navigation: ios
tertiary_navigation: 
  - name: Create a Certificate
    anchor: create-a-certificate
  - name: Export as p12
    anchor: export-as-p12
  - name: Upload to Rover
    anchor: upload-to-rover
---

# APNS Setup

The Rover [Campaigns app](https://app.rover.io/campaigns) uses [APNS](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html#//apple_ref/doc/uid/TP40008194-CH8-SW1) to deliver notifications to your app. In order to authorize APNS communication you will need to create an "Apple Push Services" certificate and upload it to Rover.

---

## Create a Certificate

Before you can upload your certificate to Rover you need to create it in the Apple [Developer portal](https://developer.apple.com/account/). Sign-in with your Apple ID and navigate to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/ios/certificate/). Click the plus (+) button at the top of the certificates list.

![Certificates, Identifiers & Profiles]({{ "/assets/ios/apns-setup/certificates-identifiers-profiles.jpg" | absolute_url }})

 On the next page, select "Apple Push Notification service SSL (Sandbox & Production)" from the list of options.

![Type of Certificate]({{ "/assets/ios/apns-setup/type-of-certificate.jpg" | absolute_url }})

Scroll to the bottom of the page and click "Continue".

![Continue]({{ "/assets/ios/apns-setup/continue.jpg" | absolute_url }})

On the next page, choose your App ID from the list and again click "Continue".

![Select App ID]({{ "/assets/ios/apns-setup/select-app-id.jpg" | absolute_url }})

The next screen provides detailed instructions for creating a Certificate Signing Request (CSR). Read through these instructions carefully. Follow the steps to use Keychain Access to create a CSR and save it to your computer. When you've successfully generated a Certificate Signing Request click "Continue" to move on to the next step.

![Creating a CSR]({{ "/assets/ios/apns-setup/creating-a-csr.jpg" | absolute_url }})

Choose the Certificate Signing Request you created in the previous step and click "Continue".

![Generate Certificate]({{ "/assets/ios/apns-setup/generate-certificate.jpg" | absolute_url }})

Download your certificate to your Mac and click "Done".

![Download Certificate]({{ "/assets/ios/apns-setup/download-certificate.jpg" | absolute_url }})

---

## Export as p12

Find the certificate you downloaded in the previous step on your Mac. Double-click the .cer file to install the certificate in Keychain Access. 

With Keychain Access open make sure you have "login" and "My Certificates" selected in the left sidebar. You should see a certificate named "Apple Push Services" with your App ID appended.

![Keychain Certificate]({{ "/assets/ios/apns-setup/keychain-certificate.jpg" | absolute_url }})

With the certificate selected (do not expand the arrow) right-click and select Export "...".

![Private Key]({{ "/assets/ios/apns-setup/keychain-export.jpg" | absolute_url }})

Select a place on your Mac where you want to store your exported certificate. Ensure the "Personal Information Exchange (.p12)" format is selected, then click "Save".

![Save as p12]({{ "/assets/ios/apns-setup/save-as-p12.jpg" | absolute_url }})

Keychain Access will prompt you for a password. Enter any _strong_ password you like but make sure you remember it. You will need the enter this password again when you upload the certificate to Rover's servers. It's a good idea to store this password in a password manager or some other secure means as you may need to enter it again in the future.

![p12 Password]({{ "/assets/ios/apns-setup/p12-password.jpg" | absolute_url }})

Keychain Access may ask for your password before exporting the certificate. The password it's asking for is your local Mac OS account password. This is expected behavior and is safe to allow.

![Allow Access]({{ "/assets/ios/apns-setup/allow-access.jpg" | absolute_url }})

---

## Upload to Rover

The final step in APNS setup is to upload the exported .p12 file to Rover's servers. 

Sign-in to the [Rover dashboard](https://app.rover.io/auth/sign-in) with your Rover account credentials and open the [Settings app](https://app.rover.io/settings). From the overview page, click on the "iOS" tile.

![Settings App]({{ "/assets/ios/apns-setup/settings-app.jpg" | absolute_url }})

From the iOS Settings page click the plus (+) icon next to APNS.

![iOS Settings]({{ "/assets/ios/apns-setup/ios-settings.jpg" | absolute_url }})


In the "Certificate Password" field of the popover, enter the same password you entered when you exported the .p12 file from Keychain Access. Then click the "Choose File..." button.

![Certificate Password]({{ "/assets/ios/apns-setup/certificate-password.jpg" | absolute_url }})

Select the .p12 file that you exported from Keychain Access and click "Choose".

![Choose Certificate]({{ "/assets/ios/apns-setup/choose-certificate.jpg" | absolute_url }})

With your .p12 certificate now selected, click Save to upload the certificate to Rover. 

![Upload Certificate]({{ "/assets/ios/apns-setup/upload-certificate.jpg" | absolute_url }})

If everything went well you should see your app's bundle identifier displayed in the APNS section of the iOS Settings page. 

![Final Step]({{ "/assets/ios/apns-setup/final-step.jpg" | absolute_url }})

If something goes wrong, try uploading your certificate again and double-checking your password. If it's still failing, try going through the steps again, ensuring your experience matches the screenshots at each step. If you're still stuck, reach out to your CSM for assistance.