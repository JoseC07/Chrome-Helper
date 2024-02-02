import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

// Import Axios library
import axios from 'axios';

// Define an interface for the quote to help with TypeScript type checking
interface Quote {
  q: string; // Quote text
  a: string; // Author
}

// Function to fetch a random inspirational quote
async function fetchRandomQuote(): Promise<Quote> {
  try {
    // Make a request to the ZenQuotes API
    const response = await axios.get('https://zenquotes.io/api/random');
    const quotes: Quote[] = response.data;

    // Assuming the API returns an array with at least one quote
    if (quotes.length > 0) {
      return quotes[0];
    } else {
      throw new Error('No quotes received from the API.');
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error; // Rethrow the error to handle it where the function is called
  }
}


/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "com.jose-caudillo.chrome-extend.quote" })
export class FetchQuote extends SingletonAction<QuoteSettings> {
	/**
	 * The {@link SingletonAction.onWillAppear} event is useful for setting the visual representation of an action when it become visible. This could be due to the Stream Deck first
	 * starting up, or the user navigating between pages / folders etc.. There is also an inverse of this event in the form of {@link streamDeck.client.onWillDisappear}. In this example,
	 * we're setting the title to the "count" that is incremented in {@link IncrementCounter.onKeyDown}.
	 */
	onWillAppear(ev: WillAppearEvent<QuoteSettings>): void | Promise<void> {
		return ev.action.setTitle(`${ev.payload.settings.quote ?? null}`);
	}

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. In this example, our action will display a counter that increments by one each press. We track the current count on the action's persisted
	 * settings using `setSettings` and `getSettings`.
	 */
	async onKeyDown(ev: KeyDownEvent<QuoteSettings>): Promise<void> {
		// Determine the current count from the settings.
		let test = ev.payload.settings.quote ?? null;
		
		fetchRandomQuote().then(quote => {
			console.log(`${quote.q} —${quote.a}`);
		  }).catch(error => {
			console.error('Failed to fetch quote:', error);
		  });

		// Update the current count in the action's settings, and change the title.

	}
}

/**
 * Settings for {@link FetchQuote}.
 */
type QuoteSettings = {
	quote: string[];
};
