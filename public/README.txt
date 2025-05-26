# Registration System Deployment Instructions

This folder contains all the necessary files for the registration system. Follow these instructions to deploy the system to your web server.

## Files Overview

1. `PhoneRegistration.html` - First step of registration (phone number)
2. `Register.html` - Second step of registration (name, email, password)
3. `ProfileSetup.html` - Third step of registration (avatar, birthday, location)
4. `RegistrationSuccess.html` - Success page after registration
5. `test-supabase.html` - Test page to verify Supabase connection
6. `css/styles.css` - Stylesheet for all pages
7. `index.html` - Redirects to the first registration page

## Deployment Instructions

1. Upload all files to your web server's `httpdocs` directory
2. Make sure the directory structure is maintained (css folder and HTML files)
3. First test the Supabase connection by accessing `test-supabase.html`
4. If the test is successful, the registration system is ready to use

## Supabase Integration

The system uses Supabase for data storage with the following details:
- Supabase URL: https://awrunspkmsvswrvphrdd.supabase.co
- Supabase API Key: [Already embedded in the HTML files]

## Testing

1. Access `test-supabase.html` to verify the connection to Supabase
2. Complete the registration flow by starting at `PhoneRegistration.html`
3. Check your Supabase dashboard to confirm that user data is being stored correctly

## Troubleshooting

If you encounter any issues:
1. Check that all files are uploaded to the correct location
2. Verify that the Supabase project is active
3. Check browser console for any JavaScript errors
4. Ensure that the Supabase API key has not expired

## Security Note

The current implementation uses the Supabase API key directly in the HTML files. For a production environment, consider implementing a more secure approach with server-side authentication.
