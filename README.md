# NewKingsboroughsite
KBC Website Newly refreshed

The contact page banner is a photo by [Yan Krukau on Pexels](https://www.pexels.com/photo/a-man-working-in-a-call-center-8867431/). The Community page banner is a [Pexels photo](https://www.pexels.com/photo/people-holding-hands-in-black-and-white-17010855/).

## Contact and prayer request emails

Enquiries and prayer requests are saved in the CMS and emailed to `info@kingsborough.org.uk`.
Configure these environment variables in the server's deployment settings (or `.env` for local development):

```
SMTP_HOST=<mail server hostname>
SMTP_PORT=<mail server port, typically 587 or 465>
SMTP_USER=<SMTP username>
SMTP_PASSWORD=<SMTP password or app password>
SMTP_FROM=<sender email address authorized by your mail provider>
```

Port 465 uses TLS immediately; other ports require STARTTLS. Use a provider and account that permit SMTP sending, and keep the password out of source control. Restart the server after changing the settings, then submit an enquiry and a prayer request to verify delivery. If email delivery fails, the submission remains in the CMS and the visitor is asked to contact the church directly; sending is not automatically retried.

Confidential requests are marked in both the CMS and the email. Restrict access to the CMS and the shared inbox to the appropriate pastoral staff; the label itself does not restrict access.

## Gallery sources (optional)

The Gallery page can pull photos from OneDrive and Instagram. Both are off until their environment variables are set (in `.env` or your host's settings); without them the page shows its built-in albums.

### OneDrive folder → albums
Staff drop photos into a OneDrive folder; each sub-folder becomes an album (photos directly in the folder go into "General"). Changes appear within ~10 minutes.

1. In the Azure portal (Entra ID → App registrations) create an app, add a **client secret**, and under *API permissions* add Microsoft Graph **Application** permission `Files.Read.All`, then **Grant admin consent**.
2. In the OneDrive of the account that owns the photos, create the folder (default name `Website Gallery`).
3. Set:
   ```
   MS_TENANT_ID=<directory (tenant) id>
   MS_CLIENT_ID=<application (client) id>
   MS_CLIENT_SECRET=<client secret value>
   ONEDRIVE_USER=<owner's email / UPN, e.g. media@church.org>
   ONEDRIVE_GALLERY_FOLDER=Website Gallery   # optional
   ```

Images are streamed through `/api/gallery/onedrive/image/:id`, so OneDrive links never expire or need public sharing. Only files inside the gallery folder can be served.

### Instagram feed → "From Instagram" album
Requires a Business or Creator Instagram account. In the Meta developer portal create an app with the *Instagram API with Instagram Login* product, add the church account as a tester/role, and generate a **long-lived access token**.
```
IG_ACCESS_TOKEN=<long-lived token>
IG_MEDIA_LIMIT=24   # optional, max 50
```
The token is refreshed automatically once a day while the server runs (tokens expire after 60 days if never refreshed). Videos are skipped.

**Tokens starting with `EAA`** (Instagram API with Facebook Login, e.g. a Business Manager system-user token) also work. These are not refreshed by the server. If the token can't see a Facebook Page linked to the Instagram account, also set the Instagram account's ID:
```
IG_USER_ID=<Instagram account ID>
```
The token needs the `instagram_basic` permission, and the Instagram account must be assigned to it.
