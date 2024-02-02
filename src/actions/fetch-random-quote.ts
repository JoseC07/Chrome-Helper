import { action, KeyDownEvent,SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

// Import Axios library
import axios from 'axios';

// Define an interface for the quote to help with TypeScript type checking
interface Quote {
  q: string; // Quote text
  a: string; // Author
}

// Function to fetch a random inspirational quote
// async function fetchRandomQuote(): Promise<Quote> {
//   try {
//     // Make a request to the ZenQuotes API
//     const response = await axios.get('https://zenquotes.io/api/random');
//     const quotes: Quote[] = response.data;

//     // Assuming the API returns an array with at least one quote
//     if (quotes.length > 0) {
//       return quotes[0];
//     } else {
//       throw new Error('No quotes received from the API.');
//     }
//   } catch (error) {
//     console.error('Error fetching quote:', error);
//     throw error; // Rethrow the error to handle it where the function is called
//   }
// }
async function fetchRandomQuote(): Promise<Quote> {
	try {
	  // Make a request to the Forismatic API
	  // Note: The URL might change based on the API version and configuration
	  const response = await axios.get('http://api.forismatic.com/api/1.0/', {
		params: {
		  method: 'getQuote',
		  format: 'json',
		  lang: 'en'
		}
	  });
  
	  // Process the API response to fit the Quote interface
	  const quoteData = response.data;
	  const quote: Quote = {
		q: quoteData.quoteText.trim(), // Ensure text is trimmed
		a: quoteData.quoteAuthor || 'Unknown' // Default to 'Unknown' if author is not provided
	  };
  
	  return quote;
	} catch (error) {
	  console.error('Error fetching quote from Forismatic:', error);
	  throw error;
	}
  }




/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "com.jose-caudillo.chrome-extend.quote" })
export class FetchQuote extends SingletonAction<Quote> {


	async onWillAppear(ev: WillAppearEvent<Quote>): Promise<void> {
		try {
		  const quote = await fetchRandomQuote();
		  await this.updateButtonTitle(ev, quote);
		} catch (error) {
		  console.error('Failed to fetch quote:', error);
		  // Optionally, update the button title to show an error message
		  await ev.action.setTitle("Error fetching quote");
		}
	}

	private async updateButtonTitle(ev: WillAppearEvent<Quote>, quote: Quote): Promise<void> {
		const maxLength = 50;
		let fullQuote = `${quote.q} —${quote.a}`;
		if (fullQuote.length > maxLength) {
			fullQuote = fullQuote.substring(0, maxLength - 3) + '...';
		}
		await ev.action.setTitle(fullQuote);
	}

	async onKeyDown(ev: KeyDownEvent<Quote>): Promise<void> {
		try {
		  const quote = await fetchRandomQuote();
		  await this.updateOnPress(ev, quote);
		} catch (error) {
		  console.error('Failed to fetch quote:', error);
		  // Optionally, update the button title to show an error message
		  await ev.action.setTitle("Error fetching quote");
		}
	}

	private async updateOnPress(ev: KeyDownEvent<Quote>, quote: Quote): Promise<void> {
		const maxLength = 50;
		let fullQuote = `${quote.q} —${quote.a}`;
		if (fullQuote.length > maxLength) {
			fullQuote = fullQuote.substring(0, maxLength - 3) + '...';
		}
		await ev.action.setTitle(fullQuote);
	}
	

}

