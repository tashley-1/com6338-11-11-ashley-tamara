const getPoemBtn = document.getElementById('get-poem');
const poemEl = document.getElementById('poem');
const poemURL = 'https://poetrydb.org/random,linecount/1;12/author,title,lines.json';

// Fetch JSON data from the provided URL
const getJSON = url => fetch(url).then(res => res.json());

// Pipe function to compose functions
const pipe = (...fns) => firstArg => fns.reduce((returnValue, fn) => fn(returnValue), firstArg);

// Function to generate HTML tags
const makeTag = tag => str => `<${tag}>${str}</${tag}>`;

// Helper function to create the stanzas with line breaks and wrapping them in <p> tags
const createStanzasHTML = lines => 
  lines
    .reduce(
      (acc, line) => 
        line === "" // An empty line indicates a new stanza
          ? [...acc, []] // Start a new stanza
          : [...acc.slice(0, -1), [...acc.slice(-1)[0], line]], // Add line to the last stanza
      [[]] // Start with one empty stanza
    )
    .map(stanza => stanza.join("<br>")) // Join the lines of each stanza with <br>
    .map(makeTag("p")) // Wrap each stanza in <p> tags
    .join(""); // Combine all stanzas into one string

// The function that generates the full poem HTML
const makePoemHTML = (poemData) => {
  const { title, author, lines } = poemData[0]; // Extract poem data

  // Create HTML for title and author using makeTag
  const titleHTML = makeTag("h2")(title);
  const authorHTML = makeTag("h3")(makeTag("em")(`by ${author}`));

  // Create the stanzas HTML using the helper function
  const stanzasHTML = createStanzasHTML(lines);

  // Combine the parts into one HTML string
  return `${titleHTML}${authorHTML}${stanzasHTML}`;
};

// Attach a click event to #get-poem
getPoemBtn.onclick = async function () {
  // Fetch the poem data and render the HTML to the poem element
  const poemData = await getJSON(poemURL);
  poemEl.innerHTML = makePoemHTML(poemData); // Display the poem
};

