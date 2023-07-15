import random

def generate_random_nation_name():
    # List of possible name components
    prefixes = ['Great', 'New', 'United', 'Democratic', 'Imperial', 'Free', 'Republic', 'People\'s']
    suffixes = ['Land', 'Nation', 'Empire', 'Republic', 'Kingdom', 'Union', 'Federation', 'State']

    # Generate a random number between 1 and 10000
    number = random.randint(1, 10000)

    # Generate the nation name
    prefix = random.choice(prefixes)
    suffix = random.choice(suffixes)
    name = f'{prefix} {suffix} {number}'

    return name

# Generate and print a random nation name
random_nation_name = generate_random_nation_name()
print(random_nation_name)



















const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const tempMailUrl = 'https://www.temp-mail.org/en/';
const politicsAndWarUrl = 'https://politicsandwar.com';

// Function to create a temporary email address using temp-mail.org
async function createTemporaryEmail() {
  try {
    const response = await axios.get(tempMailUrl);
    const $ = cheerio.load(response.data);
    const email = $('#mail').val();
    return email;
  } catch (error) {
    console.error('Error creating temporary email:', error);
    return null;
  }
}

// Function to create an account on politicsandwar.com
async function createAccount() {
  try {
    const email = await createTemporaryEmail();
    if (email) {
      const response = await axios.get(politicsAndWarUrl);
      const $ = cheerio.load(response.data);
      const csrfToken = $('input[name="_csrf"]').val();

      const form = new FormData();
      form.append('username', email);
      form.append('email', email);
      form.append('password', 'vopejon402@anwarb');
      form.append('passwordRepeat', 'vopejon402@anwarb');
      form.append('_csrf', csrfToken);

      await axios.post(`${politicsAndWarUrl}/register`, form, {
        headers: form.getHeaders(),
      });

      console.log('Account created successfully! Email:', email);
      return email;
    }
  } catch (error) {
    console.error('Error creating account:', error);
    return null;
  }
}

// Function to verify the account on politicsandwar.com
async function verifyAccount(email) {
  try {
    const response = await axios.get(tempMailUrl);
    const $ = cheerio.load(response.data);
    const verificationLink = $(`a[href*="${politicsAndWarUrl}"]`).attr('href');
    if (verificationLink) {
      await axios.get(verificationLink);
      console.log('Account verified successfully!');
      return email;
    }
  } catch (error) {
    console.error('Error verifying account:', error);
    return null;
  }
}

// Function to generate a random nation name
function generateRandomNationName() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let name = '';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    name += alphabet[randomIndex];
  }
  return name;
}

// Function to buy food from a nation
async function buyFood(email, targetNationUrl) {
  try {
    const response = await axios.get(targetNationUrl);
    const $ = cheerio.load(response.data);
    const csrfToken = $('input[name="_csrf"]').val();
    const nationId = $('input[name="nation_id"]').val();
    const targetNationName = $('.war_table tr:first-child td:first-child a').text();

    const form = new FormData();
    form.append('_csrf', csrfToken);
    form.append('buy_resource', 'food');
    form.append('buy_amount', '5000000');
    form.append('buyer_nation', nationId);
    form.append('buyer_email', email);
    form.append('buyer_nation_name', generateRandomNationName());
    form.append('buyer_nation_continent', 'Africa');
    form.append('target_nation', targetNationName);

    await axios.post(`${politicsAndWarUrl}/trade/accept`, form, {
      headers: form.getHeaders(),
    });

    console.log(`Food purchased successfully from ${targetNationUrl}!`);
  } catch (error) {
    console.error('Error buying food:', error);
  }
}

// Function to delete the account
async function deleteAccount(email) {
  try {
    const response = await axios.get(`${politicsAndWarUrl}/deleteaccount`);
    const $ = cheerio.load(response.data);
    const csrfToken = $('input[name="_csrf"]').val();

    const form = new FormData();
    form.append('username', email);
    form.append('password', email);
    form.append('confirm', 'on');
    form.append('_csrf', csrfToken);

    await axios.post(`${politicsAndWarUrl}/deleteaccount`, form, {
      headers: form.getHeaders(),
    });

    console.log('Account deleted successfully!');
  } catch (error) {
    console.error('Error deleting account:', error);
  }
}

// Function to logout from the account
async function logout() {
  try {
    await axios.get(`${politicsAndWarUrl}/logout`);
    console.log('Logged out successfully!');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

// Usage:
async function main() {
  const email = await createAccount();
  if (email) {
    await verifyAccount(email);
    // Modify the data object to include the checkbox HTML code
    const checkbox =
      '<input type="checkbox" name="age13orover" data-toggle="tooltip" title="" value="1" data-original-title="Verify you are 13 years of age or older">';
    const data = {
      checkbox,
    };
    // Use the email/password as needed in the subsequent code

    const targetNationUrl = 'https://politicsandwar.com/nation/id=552182';
    await buyFood(email, targetNationUrl);
    await deleteAccount(email);
    await logout();
  }
}

main();
